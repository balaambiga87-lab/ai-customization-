import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    const result = await this.pricingService.calculatePrice(dto);
    return {
      success: true,
      ...result,
    };
  }
}
