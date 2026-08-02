import { Controller, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { JewelleryAiService } from './jewellery-ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('api')
export class JewelleryAiController {
  constructor(private readonly jewelleryAiService: JewelleryAiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async handleChat(@Body() chatDto: ChatRequestDto): Promise<ChatResponseDto> {
    const result = await this.jewelleryAiService.processChat(
      chatDto.message,
      chatDto.sessionId,
    );

    return {
      success: true,
      reply: result.reply,
      sessionId: result.sessionId,
    };
  }

  @Delete('chat/session/:sessionId')
  @HttpCode(HttpStatus.OK)
  clearSession(@Param('sessionId') sessionId: string): { success: boolean; message: string } {
    this.jewelleryAiService.clearSession(sessionId);
    return {
      success: true,
      message: `Session ${sessionId} cleared successfully.`,
    };
  }
}
