import { Module } from '@nestjs/common';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BlueprintsController],
  providers: [BlueprintsService],
  exports: [BlueprintsService],
})
export class BlueprintsModule {}
