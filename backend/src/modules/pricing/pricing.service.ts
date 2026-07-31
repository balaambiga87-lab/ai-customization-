import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PriceProvider } from './providers/price-provider';
import { BasePriceCalculator } from './calculators/base-price.calculator';
import { MetalCalculator } from './calculators/metal.calculator';
import { GemstoneCalculator, GemInput } from './calculators/gemstone.calculator';
import { MakingChargeCalculator } from './calculators/making-charge.calculator';
import { TaxCalculator } from './calculators/tax.calculator';
import { FinalPriceCalculator, DetailedPriceBreakdown } from './calculators/final-price.calculator';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly priceProvider: PriceProvider,
  ) {}

  async calculatePrice(dto: CalculatePriceDto): Promise<{
    breakdown: DetailedPriceBreakdown;
    metadata: {
      estimatedWeight: number;
      calculatedAt: string;
      priceVersion: string;
    };
  }> {
    // 1. Query base blueprint
    const bp = await this.prisma.blueprint.findUnique({
      where: { id: dto.blueprintId },
    });
    if (!bp) {
      throw new NotFoundException(`Blueprint with ID "${dto.blueprintId}" not found.`);
    }

    // 2. Query metal material
    const metal = await this.prisma.material.findUnique({
      where: { id: dto.selectedMetalId },
    });
    if (!metal) {
      throw new NotFoundException(`Metal material with ID "${dto.selectedMetalId}" not found.`);
    }

    // 3. Resolve spot metal rates from PriceProvider
    const spotRates = await this.priceProvider.getLatestSpotRates();

    // 4. Calculate Metal Price based on density and scale factor
    let metalScale = 1.0;
    if (dto.configuration) {
      // Find metal scale modifications from shanks/anchors configurations
      for (const key of Object.keys(dto.configuration)) {
        if (key.includes('shank') || key.includes('band') || key.includes('anchor')) {
          if (dto.configuration[key]?.scale) {
            metalScale = dto.configuration[key].scale;
          }
        }
      }
    }

    const metalResult = MetalCalculator.calculate({
      materialType: metal.materialType,
      purity: metal.purity,
      density: metal.density,
      scale: metalScale,
      spotRates,
    });

    // 5. Resolve Gemstones and modular assets prices
    const gemsToCalc: GemInput[] = [];
    if (dto.selectedGemstoneId) {
      const primaryGem = await this.prisma.gemstone.findUnique({
        where: { id: dto.selectedGemstoneId },
      });
      if (primaryGem) {
        gemsToCalc.push({
          price: Number(primaryGem.price),
          carat: Number(primaryGem.carat),
          scale: 1.0,
        });
      }
    }

    let totalAssetsPrice = 0;
    let attachedAssetsCount = 0;

    const config = dto.configuration;
    if (config) {
      const assetIds = Object.values(config)
        .map((c: any) => c.assetId)
        .filter((id) => !!id) as string[];

      const gemIds = Object.values(config)
        .map((c: any) => c.gemstoneId)
        .filter((id) => !!id) as string[];

      // Sum pricing modifiers for attached assets
      if (assetIds.length > 0) {
        const assets = await this.prisma.jewelleryAsset.findMany({
          where: { id: { in: assetIds } },
        });
        assets.forEach((asset) => {
          const configItem = Object.values(config).find(
            (c: any) => c.assetId === asset.id,
          ) as any;
          const scale = configItem?.scale || 1.0;
          totalAssetsPrice += Number(asset.priceModifier) * scale;
          attachedAssetsCount++;
        });
      }

      // Sum carats calculations for secondary gemstones attached to anchors
      if (gemIds.length > 0) {
        const gems = await this.prisma.gemstone.findMany({
          where: { id: { in: gemIds } },
        });
        gems.forEach((gem) => {
          const configItem = Object.values(config).find(
            (c: any) => c.gemstoneId === gem.id,
          ) as any;
          const scale = configItem?.scale || 1.0;
          gemsToCalc.push({
            price: Number(gem.price),
            carat: Number(gem.carat),
            scale,
          });
        });
      }
    }

    const gemstoneResult = GemstoneCalculator.calculate(gemsToCalc);

    // 6. Base price
    const basePrice = BasePriceCalculator.calculate(Number(bp.basePrice));

    // 7. Making Charges calculation
    const makingCharges = MakingChargeCalculator.calculate({
      baseRate: 1500.00, // Base charge in INR
      attachedAssetsCount,
      metalWeight: metalResult.estimatedWeight,
    });

    // 8. Tax (3% GST flat on sum subtotal)
    const subtotal =
      basePrice + metalResult.price + gemstoneResult.price + totalAssetsPrice + makingCharges;
    const tax = TaxCalculator.calculate(subtotal);

    // 9. Compile Final breakdown response
    const breakdown = FinalPriceCalculator.calculate({
      basePrice,
      metalPrice: metalResult.price,
      estimatedWeight: metalResult.estimatedWeight,
      pricePerGram: metalResult.pricePerGram,
      gemstonePrice: gemstoneResult.price,
      totalCarats: gemstoneResult.totalCarats,
      assetPrice: totalAssetsPrice,
      makingCharges,
      tax,
      currency: dto.currency || 'INR',
    });

    return {
      breakdown,
      metadata: {
        estimatedWeight: metalResult.estimatedWeight,
        calculatedAt: new Date().toISOString(),
        priceVersion: 'v1.2-spot-detailed',
      },
    };
  }
}
