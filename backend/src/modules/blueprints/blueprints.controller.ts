import { Controller, Get, Param } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';

@Controller('blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Get()
  async findAll() {
    const data = await this.blueprintsService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.blueprintsService.findOne(id);
    return { success: true, data };
  }

  @Get(':id/anchors')
  async findAnchors(@Param('id') id: string) {
    const data = await this.blueprintsService.findAnchors(id);
    return { success: true, data };
  }
}
