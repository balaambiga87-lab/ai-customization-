import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiReviewService } from './ai-review.service';

@Controller('ai/review')
export class AiReviewController {
  constructor(private readonly aiReviewService: AiReviewService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async reviewDesign(
    @Body()
    body: {
      blueprintId: string;
      selectedMetalId: string | null;
      selectedGemstoneId: string | null;
      configuration: any;
      estimatedPrice: number;
    },
  ) {
    return this.aiReviewService.reviewDesign(body);
  }

  @Post('improve')
  @HttpCode(HttpStatus.OK)
  async improveDesign(
    @Body()
    body: {
      blueprintId: string;
      selectedMetalId: string | null;
      selectedGemstoneId: string | null;
      configuration: any;
      estimatedPrice: number;
      suggestions: any[];
    },
  ) {
    return this.aiReviewService.improveDesign(body);
  }
}
