import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { StructuredDesign } from '../types/interpreter.types';

@Injectable()
export class DesignBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Automatically parses structured design JSON to compile SaveDesign and DesignObject relational bridges.
   */
  async buildDesignFromJSON(userId: string, design: StructuredDesign): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Resolve Blueprint Setting
      const blueprint = await tx.blueprint.findFirst({
        where: {
          name: { contains: design.productType, mode: 'insensitive' },
        },
        include: {
          anchors: true,
        },
      });

      if (!blueprint) {
        throw new BadRequestException(
          `No customizable blueprint setting exists matching type "${design.productType}".`,
        );
      }

      // 2. Resolve Metal Material
      const material = await tx.material.findFirst({
        where: {
          name: { contains: design.metal.type, mode: 'insensitive' },
          purity: { contains: design.metal.karat, mode: 'insensitive' },
        },
      });

      if (!material) {
        throw new BadRequestException(
          `No active metal matching type "${design.metal.type}" and purity "${design.metal.karat}" found in inventory.`,
        );
      }

      // 3. Resolve Gemstone
      let stoneId: string | null = null;
      let gemstonePrice = 0;
      if (design.centerStone) {
        const gemstone = await tx.gemstone.findFirst({
          where: {
            type: { equals: design.centerStone.type, mode: 'insensitive' },
            shape: { equals: design.centerStone.shape, mode: 'insensitive' },
          },
        });

        if (!gemstone) {
          throw new BadRequestException(
            `No gemstone matching shape "${design.centerStone.shape}" and type "${design.centerStone.type}" exists.`,
          );
        }

        stoneId = gemstone.id;
        gemstonePrice = Number(gemstone.price);
      }

      // 4. Create SavedDesign Base Setup
      const defaultName = `${design.style || 'Custom'} ${design.metal.karat} ${design.metal.type} ${design.productType}`;
      const metalCostEstimation = 5.0 * Number(material.pricePerGram); // mock volume weight
      let totalPrice = Number(blueprint.basePrice) + gemstonePrice + metalCostEstimation;

      const savedDesign = await tx.savedDesign.create({
        data: {
          userId,
          blueprintId: blueprint.id,
          name: defaultName,
          configuration: design as any,
          totalPrice: totalPrice,
        },
      });

      // 5. Map Decorative Part Assets
      const mappedAssets: Array<{ anchorId: string; assetId: string; price: number }> = [];
      if (design.decorations && design.decorations.length > 0) {
        for (const dec of design.decorations) {
          const asset = await tx.jewelleryAsset.findFirst({
            where: {
              name: { contains: dec.type, mode: 'insensitive' },
            },
          });

          if (asset) {
            // Match an empty anchor allowing this category code
            const matchingAnchor = blueprint.anchors.find((anchor) => {
              const allowedIds = anchor.allowedAssetCategoryIds as string[];
              return allowedIds.includes(asset.assetCategoryId);
            });

            if (matchingAnchor) {
              mappedAssets.push({
                anchorId: matchingAnchor.id,
                assetId: asset.id,
                price: Number(asset.priceModifier),
              });
            }
          }
        }
      }

      // Create relational design objects for decorations
      let decorationsCost = 0;
      for (const ma of mappedAssets) {
        decorationsCost += ma.price;
        await tx.designObject.create({
          data: {
            savedDesignId: savedDesign.id,
            blueprintAnchorId: ma.anchorId,
            jewelleryAssetId: ma.assetId,
            priceCalculated: ma.price,
          },
        });
      }

      // Add band metal relational configuration
      const bandAnchor = blueprint.anchors.find((a) => a.anchorType === 'BAND_PART');
      if (bandAnchor) {
        await tx.designObject.create({
          data: {
            savedDesignId: savedDesign.id,
            blueprintAnchorId: bandAnchor.id,
            materialId: material.id,
            priceCalculated: metalCostEstimation,
          },
        });
      }

      // Add center stone relational configuration
      const centerStoneAnchor = blueprint.anchors.find((a) => a.anchorType === 'GEM_SLOT');
      if (centerStoneAnchor && stoneId) {
        await tx.designObject.create({
          data: {
            savedDesignId: savedDesign.id,
            blueprintAnchorId: centerStoneAnchor.id,
            gemstoneId: stoneId,
            priceCalculated: gemstonePrice,
          },
        });
      }

      // Update SavedDesign final computed price
      const finalPrice = totalPrice + decorationsCost;
      await tx.savedDesign.update({
        where: { id: savedDesign.id },
        data: { totalPrice: finalPrice },
      });

      return savedDesign.id;
    });
  }
}
