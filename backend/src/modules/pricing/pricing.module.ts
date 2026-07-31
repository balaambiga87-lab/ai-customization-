import { Module } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PriceProvider } from './providers/price-provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PricingController],
  providers: [PricingService, PriceProvider],
  exports: [PricingService, PriceProvider],
})
export class PricingModule {}
