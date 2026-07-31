import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { MappedDesign, StructuredDesign, MappedAsset } from '../types/interpreter.types';
import { getSystemPrompt } from '../prompts/system-instructions.prompt';
import { ResponseCleanerParser } from '../parsers/response-cleaner.parser';
import { DesignCompatValidator } from '../validators/design-compat.validator';
import axios from 'axios';

@Injectable()
export class AiInterpreterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Interprets user prompt and maps items to database assets.
   */
  async interpretPrompt(userId: string | null, prompt: string): Promise<{
    mappedDesign: MappedDesign;
    promptHistoryId: string;
    structuredDesign: StructuredDesign;
  }> {
    const catalogContext = await this.getCatalogContext();
    let parsedDesign: StructuredDesign;
    let confidenceScore = 0.92;

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (apiKey && apiKey !== 'AIzaSy...') {
      try {
        parsedDesign = await this.callGeminiAPI(apiKey, prompt, catalogContext);
      } catch (error) {
        console.warn('Gemini API call failed, falling back to local heuristic parser...', (error as any).message);
        parsedDesign = this.localHeuristicParse(prompt);
        confidenceScore = 0.65;
      }
    } else {
      console.log('No active GEMINI_API_KEY detected. Using local heuristic parser...');
      parsedDesign = this.localHeuristicParse(prompt);
      confidenceScore = 0.50;
    }

    // 1. Validate structured JSON design
    DesignCompatValidator.validate(parsedDesign);

    // 2. Perform DB Asset Mapping
    const mappedDesign = await this.mapToDatabaseAssets(parsedDesign, confidenceScore);

    // 3. Log into PromptHistory
    const history = await this.prisma.promptHistory.create({
      data: {
        userId,
        promptText: prompt,
        enhancedPromptText: `Interpreted design: ${parsedDesign.style || 'Custom'} ${parsedDesign.productType}`,
        settings: parsedDesign as any,
      },
    });

    return {
      mappedDesign,
      promptHistoryId: history.id,
      structuredDesign: parsedDesign,
    };
  }

  /**
   * Assembles a text summarizing active database entities for LLM context.
   */
  private async getCatalogContext(): Promise<string> {
    const materials = await this.prisma.material.findMany({ where: { isActive: true } });
    const gemstones = await this.prisma.gemstone.findMany({ where: { isActive: true } });
    const assets = await this.prisma.jewelleryAsset.findMany({ where: { isActive: true } });

    const materialText = materials.map((m) => `- Metal Material: Name="${m.name}", Purity="${m.purity}", Type="${m.materialType}"`).join('\n');
    const gemstoneText = gemstones.map((g) => `- Gemstone: Name="${g.name}", Type="${g.type}", Shape="${g.shape}", Carat=${g.carat}`).join('\n');
    const assetText = assets.map((a) => `- Part Asset: Name="${a.name}", SKU="${a.sku}"`).join('\n');

    return `Available Metals:\n${materialText}\n\nAvailable Gemstones:\n${gemstoneText}\n\nAvailable Part Assets:\n${assetText}`;
  }

  /**
   * Calls the Gemini REST API to interpret user prompt.
   */
  private async callGeminiAPI(apiKey: string, prompt: string, context: string): Promise<StructuredDesign> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemInstruction = getSystemPrompt(context);

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${systemInstruction}\n\nUser Design Request: "${prompt}"\n\nJSON Output:`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    };

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    return ResponseCleanerParser.cleanAndParse(responseText);
  }

  /**
   * Fallback heuristic keyword-matcher for offline/development test runs.
   */
  private localHeuristicParse(prompt: string): StructuredDesign {
    const text = prompt.toLowerCase();
    const result: StructuredDesign = {
      productType: 'Ring',
      metal: { type: 'Gold', karat: '18K' },
    };

    if (text.includes('necklace') || text.includes('pendant')) {
      result.productType = 'Necklace';
    } else if (text.includes('earring')) {
      result.productType = 'Earrings';
    }

    if (text.includes('rose')) {
      result.metal = { type: 'Rose Gold', karat: '18K' };
    } else if (text.includes('white')) {
      result.metal = { type: 'White Gold', karat: '18K' };
    } else if (text.includes('platinum')) {
      result.metal = { type: 'Platinum', karat: '950' };
    }

    if (text.includes('diamond')) {
      result.centerStone = { type: 'diamond', shape: 'Round', size: '1.0ct' };
    } else if (text.includes('emerald')) {
      result.centerStone = { type: 'emerald', shape: 'Oval', size: '2.0ct' };
    }

    if (result.centerStone) {
      if (text.includes('pear')) result.centerStone.shape = 'Pear';
      else if (text.includes('oval')) result.centerStone.shape = 'Oval';
      else if (text.includes('emerald')) result.centerStone.shape = 'Emerald';
    }

    if (text.includes('leaf')) {
      result.decorations = [{ type: 'Leaf', quantity: 2 }];
    }

    return result;
  }

  /**
   * Resolves text attributes returned by the LLM to database UUID records.
   */
  private async mapToDatabaseAssets(parsed: StructuredDesign, confidence: number): Promise<MappedDesign> {
    // 1. Resolve Metal Material with graceful fallback
    let material = await this.prisma.material.findFirst({
      where: {
        name: { contains: parsed.metal.type, mode: 'insensitive' },
        purity: { contains: parsed.metal.karat, mode: 'insensitive' },
      },
    });

    if (!material) {
      material = await this.prisma.material.findFirst({
        where: { name: { contains: parsed.metal.type, mode: 'insensitive' } },
      });
    }

    if (!material) {
      material = await this.prisma.material.findFirst();
    }

    if (!material) {
      throw new BadRequestException('No materials found in database catalog.');
    }

    // 2. Resolve Gemstone with graceful fallback
    let stoneId: string | null = null;
    if (parsed.centerStone) {
      let gemstone = await this.prisma.gemstone.findFirst({
        where: {
          type: { equals: parsed.centerStone.type, mode: 'insensitive' },
          shape: { equals: parsed.centerStone.shape, mode: 'insensitive' },
        },
      });

      if (!gemstone) {
        gemstone = await this.prisma.gemstone.findFirst({
          where: { type: { equals: parsed.centerStone.type, mode: 'insensitive' } },
        });
      }

      if (!gemstone) {
        gemstone = await this.prisma.gemstone.findFirst();
      }

      stoneId = gemstone ? gemstone.id : null;
    }

    // 3. Select Blueprint based on product type with fallback
    let blueprint = await this.prisma.blueprint.findFirst({
      where: {
        name: { contains: parsed.productType, mode: 'insensitive' },
      },
      include: {
        anchors: true,
      },
    });

    if (!blueprint) {
      blueprint = await this.prisma.blueprint.findFirst({
        include: { anchors: true },
      });
    }

    if (!blueprint) {
      throw new BadRequestException('No blueprint setting skeletons found in database.');
    }

    // 4. Map Decorations to Blueprint Anchors
    const mappedAssets: MappedAsset[] = [];
    if (parsed.decorations && parsed.decorations.length > 0) {
      for (const dec of parsed.decorations) {
        const asset = await this.prisma.jewelleryAsset.findFirst({
          where: {
            name: { contains: dec.type, mode: 'insensitive' },
          },
        });

        if (asset) {
          // Find matching anchor matching the allowed category type criteria
          const matchingAnchor = blueprint.anchors.find((anchor) => {
            const allowedCategoryIds = anchor.allowedAssetCategoryIds as string[];
            return allowedCategoryIds.includes(asset.assetCategoryId);
          });

          if (matchingAnchor) {
            mappedAssets.push({
              anchorName: matchingAnchor.name,
              assetId: asset.id,
              name: asset.name,
              priceCalculated: Number(asset.priceModifier),
            });
          }
        }
      }
    }

    // Calculate dynamic pricing approximation
    let estimatedPrice = Number(blueprint.basePrice);
    if (material) {
      // Add material cost: density * volume modifier * pricePerGram
      estimatedPrice += 5.0 * Number(material.pricePerGram);
    }
    if (stoneId) {
      const gem = await this.prisma.gemstone.findUnique({ where: { id: stoneId } });
      if (gem) estimatedPrice += Number(gem.price);
    }
    mappedAssets.forEach((ma) => {
      estimatedPrice += ma.priceCalculated;
    });

    return {
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      metalMaterialId: material ? material.id : null,
      centerStoneId: stoneId,
      mappedAssets,
      customText: parsed.engraving || null,
      estimatedPrice,
      confidenceScore: confidence,
    };
  }
}
