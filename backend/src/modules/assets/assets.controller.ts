import { Controller, Get, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryCode') categoryCode?: string,
  ) {
    const data = await this.assetsService.findAll({ page, limit, search, categoryCode });
    return { success: true, ...data };
  }

  @Get('categories')
  async findCategories() {
    const data = await this.assetsService.findCategories();
    return { success: true, data };
  }
}
