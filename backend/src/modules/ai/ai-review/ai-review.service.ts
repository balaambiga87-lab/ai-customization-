import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { getReviewPrompt, getImprovePrompt } from './prompts/review-prompt';
import { ResponseCleanerParser } from '../parsers/response-cleaner.parser';
import axios from 'axios';

@Injectable()
export class AiReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Evaluates the custom jewellery configuration.
   */
  async reviewDesign(dto: {
    blueprintId: string;
    selectedMetalId: string | null;
    selectedGemstoneId: string | null;
    configuration: any;
    estimatedPrice: number;
  }) {
    const catalogContext = await this.getCatalogContext();
    const designContext = await this.getDesignContext(dto);

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (apiKey && apiKey !== 'AIzaSy...') {
      try {
        const reviewJson = await this.callGeminiReviewAPI(apiKey, designContext, catalogContext);
        return { success: true, ...reviewJson };
      } catch (error) {
        console.warn('Gemini review API call failed. Using local heuristic fallback...', (error as any).message);
        const fallback = await this.localHeuristicReview(dto);
        return { success: true, ...fallback };
      }
    } else {
      console.log('No active GEMINI_API_KEY. Using local heuristic design auditor...');
      const fallback = await this.localHeuristicReview(dto);
      return { success: true, ...fallback };
    }
  }

  /**
   * Generates an improved design configuration based on suggestions.
   */
  async improveDesign(dto: {
    blueprintId: string;
    selectedMetalId: string | null;
    selectedGemstoneId: string | null;
    configuration: any;
    estimatedPrice: number;
    suggestions: any[];
  }) {
    const catalogContext = await this.getCatalogContext();
    const designContext = await this.getDesignContext(dto);
    const suggestionsContext = JSON.stringify(dto.suggestions, null, 2);

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (apiKey && apiKey !== 'AIzaSy...') {
      try {
        const improvedJson = await this.callGeminiImproveAPI(apiKey, designContext, suggestionsContext, catalogContext);
        return { success: true, data: improvedJson };
      } catch (error) {
        console.warn('Gemini improve API call failed. Using local improve rules...', (error as any).message);
        const fallback = this.localImproveLogic(dto);
        return { success: true, data: fallback };
      }
    } else {
      const fallback = this.localImproveLogic(dto);
      return { success: true, data: fallback };
    }
  }

  private async getCatalogContext(): Promise<string> {
    const materials = await this.prisma.material.findMany({ where: { isActive: true } });
    const gemstones = await this.prisma.gemstone.findMany({ where: { isActive: true } });
    const assets = await this.prisma.jewelleryAsset.findMany({ where: { isActive: true } });

    const materialText = materials.map((m) => `- Metal Material: ID="${m.id}", Name="${m.name}", Purity="${m.purity}", Type="${m.materialType}"`).join('\n');
    const gemstoneText = gemstones.map((g) => `- Gemstone: ID="${g.id}", Name="${g.name}", Type="${g.type}", Shape="${g.shape}", Price=${g.price}`).join('\n');
    const assetText = assets.map((a) => `- Part Asset: ID="${a.id}", Name="${a.name}", SKU="${a.sku}"`).join('\n');

    return `Available Metals:\n${materialText}\n\nAvailable Gemstones:\n${gemstoneText}\n\nAvailable Part Assets:\n${assetText}`;
  }

  private async getDesignContext(dto: {
    blueprintId: string;
    selectedMetalId: string | null;
    selectedGemstoneId: string | null;
    configuration: any;
    estimatedPrice: number;
  }): Promise<string> {
    const blueprint = await this.prisma.blueprint.findUnique({ where: { id: dto.blueprintId } });
    const metal = dto.selectedMetalId ? await this.prisma.material.findUnique({ where: { id: dto.selectedMetalId } }) : null;
    const gemstone = dto.selectedGemstoneId ? await this.prisma.gemstone.findUnique({ where: { id: dto.selectedGemstoneId } }) : null;

    return `
Blueprint: "${blueprint?.name || 'Unknown'}" (ID: ${dto.blueprintId})
Metal: "${metal?.name || 'None'}" (Purity: ${metal?.purity || 'None'}, ID: ${dto.selectedMetalId})
Gemstone: "${gemstone?.name || 'None'}" (Type: ${gemstone?.type || 'None'}, Shape: ${gemstone?.shape || 'None'}, ID: ${dto.selectedGemstoneId})
Configuration: ${JSON.stringify(dto.configuration, null, 2)}
Current Price: $${dto.estimatedPrice}
`;
  }

  private async callGeminiReviewAPI(apiKey: string, designContext: string, catalogContext: string): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = getReviewPrompt(designContext, catalogContext);

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error('Gemini API returned an empty response.');

    return ResponseCleanerParser.cleanAndParse(responseText);
  }

  private async callGeminiImproveAPI(
    apiKey: string,
    designContext: string,
    suggestionsContext: string,
    catalogContext: string,
  ): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = getImprovePrompt(designContext, suggestionsContext, catalogContext);

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error('Gemini API returned an empty response.');

    return ResponseCleanerParser.cleanAndParse(responseText);
  }

  /**
   * Rule-based style evaluation fallback.
   */
  private async localHeuristicReview(dto: {
    blueprintId: string;
    selectedMetalId: string | null;
    selectedGemstoneId: string | null;
    configuration: any;
    estimatedPrice: number;
  }): Promise<any> {
    const blueprint = await this.prisma.blueprint.findUnique({ where: { id: dto.blueprintId } });
    const metal = dto.selectedMetalId ? await this.prisma.material.findUnique({ where: { id: dto.selectedMetalId } }) : null;
    const gemstone = dto.selectedGemstoneId ? await this.prisma.gemstone.findUnique({ where: { id: dto.selectedGemstoneId } }) : null;

    let score = 75;
    let styleConsistency = 80;
    let colorHarmony = 80;
    let symmetry = 90;
    let luxuryAppeal = 75;
    let manufacturingComplexity = 25;
    let budgetSuitability = 85;

    const suggestions: any[] = [];

    const metalName = (metal?.name || '').toLowerCase();
    const stoneType = (gemstone?.type || '').toLowerCase();
    const stoneShape = (gemstone?.shape || '').toLowerCase();

    // 1. Color Harmony Analysis
    if (metalName.includes('yellow gold') || metalName.includes('rose gold')) {
      if (stoneType.includes('emerald') || stoneType.includes('ruby')) {
        colorHarmony += 15;
        score += 5;
      } else if (stoneType.includes('sapphire')) {
        colorHarmony -= 10;
        suggestions.push({
          type: 'material',
          title: 'Switch to White Gold / Platinum setting',
          description: 'Deep blue sapphires display maximum vibrancy and color harmony when mounted in white gold or platinum settings.',
          target: 'metal',
          replacementValue: 'mat-white-gold',
          priceImpact: 0,
        });
      }
    }

    // 2. Luxury Appeal Evaluation
    if (metalName.includes('platinum')) {
      luxuryAppeal += 15;
      score += 5;
    }
    if (stoneType.includes('diamond')) {
      luxuryAppeal += 10;
      if (metalName.includes('yellow gold')) {
        suggestions.push({
          type: 'luxury',
          title: 'Upgrade setting metal to Platinum',
          description: 'A platinum mount is highly recommended for diamonds to preserve their colorless sparkle without reflecting yellow undertones.',
          target: 'metal',
          replacementValue: 'mat-platinum',
          priceImpact: 200,
        });
      }
    }

    // 3. Layout checks
    let foundScaleIssue = false;
    if (dto.configuration) {
      for (const [anchorName, comp] of Object.entries(dto.configuration) as any) {
        if (comp && comp.scale) {
          if (comp.scale > 1.4) {
            foundScaleIssue = true;
            symmetry -= 15;
            manufacturingComplexity += 20;
            score -= 10;
            suggestions.push({
              type: 'layout',
              title: `Optimize scale on ${anchorName}`,
              description: 'The scale of the custom attachment exceeds standard limits, which may cause stability or manufacturing issues.',
              target: anchorName,
              replacementValue: JSON.stringify({ scale: 1.0, rotation: comp.rotation || 0 }),
              priceImpact: 0,
            });
          }
        }
      }
    }

    // Ensure we don't return too many suggestions
    const finalSuggestions = suggestions.slice(0, 3);

    // Caps
    score = Math.min(100, Math.max(0, score));

    return {
      score,
      designSummary: `Custom ${metal?.purity || '18K'} ${metal?.name || 'Metal'} ${blueprint?.name || 'Jewellery'} Setting`,
      ratings: {
        styleConsistency,
        colorHarmony,
        symmetry,
        luxuryAppeal,
        manufacturingComplexity,
        budgetSuitability,
      },
      suggestions: finalSuggestions,
    };
  }

  /**
   * Rule-based fallback suggestion applier.
   */
  private localImproveLogic(dto: {
    blueprintId: string;
    selectedMetalId: string | null;
    selectedGemstoneId: string | null;
    configuration: any;
    estimatedPrice: number;
    suggestions: any[];
  }): any {
    let selectedMetalId = dto.selectedMetalId;
    let selectedGemstoneId = dto.selectedGemstoneId;
    const components = { ...dto.configuration };

    for (const sug of dto.suggestions) {
      if (sug.target === 'metal') {
        selectedMetalId = sug.replacementValue;
      } else if (sug.target === 'gemstone') {
        selectedGemstoneId = sug.replacementValue;
      } else if (components[sug.target]) {
        try {
          const parsedVal = JSON.parse(sug.replacementValue);
          components[sug.target] = {
            ...components[sug.target],
            ...parsedVal,
          };
        } catch {
          // Just replace asset ID if value is a string
          components[sug.target] = {
            ...components[sug.target],
            assetId: sug.replacementValue,
          };
        }
      }
    }

    return {
      selectedMetalId,
      selectedGemstoneId,
      components,
      estimatedPrice: dto.estimatedPrice,
    };
  }
}
