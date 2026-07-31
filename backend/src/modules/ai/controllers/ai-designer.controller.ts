import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AiInterpreterService } from '../services/ai-interpreter.service';
import { ImageGenerationService } from '../image-generation/image-generation.service';
import { DesignBuilderService } from '../services/design-builder.service';
import { InterpretDesignDto, RegeneratePreviewDto, AcceptPreviewDto } from '../dto/interpret-design.dto';
import { StructuredDesign } from '../types/interpreter.types';

@Controller('ai')
export class AiDesignerController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiInterpreterService: AiInterpreterService,
    private readonly imageGenerationService: ImageGenerationService,
    private readonly designBuilderService: DesignBuilderService,
  ) {}

  /**
   * Interprets user prompt to structured JSON, generates a preview image, and saves the history log.
   */
  @Post('generate-preview')
  @HttpCode(HttpStatus.CREATED)
  async generatePreview(@Body() dto: InterpretDesignDto) {
    const guestUser = await this.getOrCreateDefaultUser();

    // 1. Parse prompt
    const { mappedDesign, promptHistoryId, structuredDesign } = 
      await this.aiInterpreterService.interpretPrompt(guestUser.id, dto.prompt);

    // 2. Generate catalogue image
    const { imageUrl, promptText } = await this.imageGenerationService.generateImage(structuredDesign);

    // 3. Store preview
    const preview = await this.prisma.aIGeneratedPreview.create({
      data: {
        promptHistoryId,
        imageUrl,
        isSaved: false,
      },
    });

    const designSummary = `${structuredDesign.style || 'Custom'} ${structuredDesign.metal.karat} ${structuredDesign.metal.type} ${structuredDesign.productType}`;

    return {
      success: true,
      message: 'AI Preview generated successfully.',
      preview: {
        id: preview.id,
        imageUrl: preview.imageUrl,
        isSaved: preview.isSaved,
        promptText,
        createdAt: preview.createdAt,
      },
      designSummary,
      data: mappedDesign,
    };
  }

  /**
   * Generates a new image preview variation from a previous design.
   */
  @Post('regenerate-preview')
  @HttpCode(HttpStatus.CREATED)
  async regeneratePreview(@Body() dto: RegeneratePreviewDto) {
    const history = await this.prisma.promptHistory.findUnique({
      where: { id: dto.promptHistoryId },
    });

    if (!history) {
      throw new NotFoundException(`Prompt history record with ID "${dto.promptHistoryId}" was not found.`);
    }

    const structuredDesign = history.settings as unknown as StructuredDesign;

    // 1. Re-generate visual asset
    const { imageUrl, promptText } = await this.imageGenerationService.generateImage(structuredDesign);

    // 2. Create another preview log version
    const preview = await this.prisma.aIGeneratedPreview.create({
      data: {
        promptHistoryId: history.id,
        imageUrl,
        isSaved: false,
      },
    });

    const designSummary = `${structuredDesign.style || 'Custom'} ${structuredDesign.metal.karat} ${structuredDesign.metal.type} ${structuredDesign.productType}`;

    return {
      success: true,
      message: 'AI Preview variation regenerated successfully.',
      preview: {
        id: preview.id,
        imageUrl: preview.imageUrl,
        isSaved: preview.isSaved,
        promptText,
        createdAt: preview.createdAt,
      },
      designSummary,
    };
  }

  /**
   * Concretizes the visual preview to create an editable design inside the builder.
   */
  @Post('accept-preview')
  @HttpCode(HttpStatus.OK)
  async acceptPreview(@Body() dto: AcceptPreviewDto) {
    const preview = await this.prisma.aIGeneratedPreview.findUnique({
      where: { id: dto.previewId },
      include: { promptHistory: true },
    });

    if (!preview) {
      throw new NotFoundException(`Preview with ID "${dto.previewId}" not found.`);
    }

    if (preview.isSaved) {
      return {
        success: true,
        message: 'Preview has already been accepted.',
        data: {
          savedDesignId: preview.savedDesignId,
        },
      };
    }

    const structuredDesign = preview.promptHistory.settings as unknown as StructuredDesign;
    const guestUser = await this.getOrCreateDefaultUser();

    // Compile SavedDesign database records
    const savedDesignId = await this.designBuilderService.buildDesignFromJSON(guestUser.id, structuredDesign);

    // Update accepted flags
    await this.prisma.aIGeneratedPreview.update({
      where: { id: preview.id },
      data: {
        isSaved: true,
        savedDesignId,
      },
    });

    return {
      success: true,
      message: 'Preview accepted. SavedDesign created successfully.',
      data: {
        savedDesignId,
      },
    };
  }

  /**
   * Fetches preview record details.
   */
  @Get('previews/:id')
  async getPreview(@Param('id') id: string) {
    const preview = await this.prisma.aIGeneratedPreview.findUnique({
      where: { id },
      include: { promptHistory: true },
    });

    if (!preview) {
      throw new NotFoundException(`Preview with ID "${id}" not found.`);
    }

    return {
      success: true,
      data: preview,
    };
  }

  /**
   * Helper to ensure a guest user context exists during testing runs.
   */
  private async getOrCreateDefaultUser() {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'guest@caratline.com',
          password: '$2b$10$Eixk9.S23wD4A9d5z9.m9.O59uVlqKz6n5e8oF.f5Kq.v1t7oAxeS',
          name: 'Guest Customer',
          role: 'USER',
        },
      });
    }
    return user;
  }
}
