import { Module } from '@nestjs/common';
import { TryOnService } from './try-on/try-on.service';
import { RecommenderService } from './recommender/recommender.service';
import { GeneratorService } from './generator/generator.service';
import { AiInterpreterService } from './services/ai-interpreter.service';
import { ImageGenerationService } from './image-generation/image-generation.service';
import { DesignBuilderService } from './services/design-builder.service';
import { AiDesignerController } from './controllers/ai-designer.controller';

import { AiReviewService } from './ai-review/ai-review.service';
import { AiReviewController } from './ai-review/ai-review.controller';

import { JewelleryAiModule } from './assistant/jewellery-ai.module';

@Module({
  imports: [JewelleryAiModule],
  controllers: [AiDesignerController, AiReviewController],
  providers: [
    TryOnService,
    RecommenderService,
    GeneratorService,
    AiInterpreterService,
    ImageGenerationService,
    DesignBuilderService,
    AiReviewService,
  ],
  exports: [
    TryOnService,
    RecommenderService,
    GeneratorService,
    AiInterpreterService,
    ImageGenerationService,
    DesignBuilderService,
    AiReviewService,
  ],
})
export class AiModule {}
