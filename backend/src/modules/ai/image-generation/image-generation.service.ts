import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StructuredDesign } from '../types/interpreter.types';
import axios from 'axios';

@Injectable()
export class ImageGenerationService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Generates a high-end catalogue photo based on structured design parameters.
   */
  async generateImage(design: StructuredDesign): Promise<{ imageUrl: string; promptText: string }> {
    const promptText = this.buildImagePrompt(design);
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (openaiKey && openaiKey !== 'sk-proj-...') {
      try {
        const imageUrl = await this.callDallE3(openaiKey, promptText);
        return { imageUrl, promptText };
      } catch (error) {
        console.warn('DALL-E 3 API call failed, falling back to mock preview...', (error as any).message);
        const fallbackUrl = design.productType.toLowerCase() === 'necklace'
          ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
        return {
          imageUrl: fallbackUrl,
          promptText,
        };
      }
    } else {
      console.log('No active OPENAI_API_KEY detected. Using curated luxury preview URL...');
      const fallbackUrl = design.productType.toLowerCase() === 'necklace'
        ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
      return {
        imageUrl: fallbackUrl,
        promptText,
      };
    }
  }

  /**
   * Compiles structured parameters into a professional jewellery catalog image prompt.
   */
  private buildImagePrompt(design: StructuredDesign): string {
    const metalStr = `${design.metal.karat} ${design.metal.type}`;
    const stoneStr = design.centerStone
      ? `featuring a ${design.centerStone.size || '1.0ct'} ${design.centerStone.shape} ${design.centerStone.type}`
      : 'without a center stone';

    const decs = design.decorations && design.decorations.length > 0
      ? `and decorated with ${design.decorations.map((d) => `${d.quantity || 1} ${d.type}`).join(', ')}`
      : '';

    const engravingStr = design.engraving ? `engraved with text "${design.engraving}" inside` : '';

    return `A high-end, professional catalogue style product photograph of a luxury ${design.style || 'Classic'} ${metalStr} ${design.productType}, ${stoneStr} ${decs} ${engravingStr}. The jewellery is positioned on a pure clean white background, capturing realistic macro details, luxury diffuse lighting, sharp reflection details, front-facing view, 4k resolution, no human model in photo.`.trim();
  }

  /**
   * Calls OpenAI DALL-E 3 endpoint.
   */
  private async callDallE3(apiKey: string, prompt: string): Promise<string> {
    const url = 'https://api.openai.com/v1/images/generations';
    const payload = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      response_format: 'url',
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const imageUrl = response.data?.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('DALL-E 3 API returned an empty image URL payload.');
    }

    return imageUrl;
  }
}
