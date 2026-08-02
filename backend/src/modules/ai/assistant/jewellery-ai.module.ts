import { Module } from '@nestjs/common';
import { JewelleryAiController } from './jewellery-ai.controller';
import { JewelleryAiService } from './jewellery-ai.service';

@Module({
  controllers: [JewelleryAiController],
  providers: [JewelleryAiService],
  exports: [JewelleryAiService],
})
export class JewelleryAiModule {}
