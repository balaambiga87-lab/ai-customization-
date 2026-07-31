import { Module } from '@nestjs/common';
import { DesignsController } from './designs.controller';
import { DesignsService } from './designs.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DesignsController],
  providers: [DesignsService],
  exports: [DesignsService],
})
export class DesignsModule {}
