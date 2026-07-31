import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { DesignsService } from './designs.service';
import { PrismaService } from '../../database/prisma.service';

@Controller('designs')
export class DesignsController {
  constructor(
    private readonly designsService: DesignsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      blueprintId: string;
      name: string;
      configuration: any;
      totalPrice: number;
      userId?: string;
    },
  ) {
    let uId = body.userId;
    if (!uId) {
      const user = await this.prisma.user.findFirst();
      if (user) {
        uId = user.id;
      } else {
        const defaultUser = await this.prisma.user.create({
          data: {
            email: 'guest@caratline.com',
            password: '$2b$10$Eixk9.S23wD4A9d5z9.m9.O59uVlqKz6n5e8oF.f5Kq.v1t7oAxeS',
            name: 'Guest Customer',
            role: 'USER',
          },
        });
        uId = defaultUser.id;
      }
    }

    const data = await this.designsService.create({
      userId: uId,
      blueprintId: body.blueprintId,
      name: body.name,
      configuration: body.configuration,
      totalPrice: body.totalPrice,
    });
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.designsService.findOne(id);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; configuration?: any; totalPrice?: number },
  ) {
    const data = await this.designsService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.designsService.remove(id);
    return { success: true, message: 'Design deleted successfully.' };
  }
}
