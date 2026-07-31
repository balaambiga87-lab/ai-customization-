import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DesignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    blueprintId: string;
    name: string;
    configuration: any;
    totalPrice: number;
  }) {
    return this.prisma.savedDesign.create({
      data: {
        userId: data.userId,
        blueprintId: data.blueprintId,
        name: data.name,
        configuration: data.configuration,
        totalPrice: data.totalPrice,
      },
    });
  }

  async findOne(id: string) {
    const design = await this.prisma.savedDesign.findUnique({
      where: { id },
      include: { blueprint: { include: { anchors: true } } },
    });
    if (!design) throw new NotFoundException(`Saved design with ID "${id}" not found.`);
    return design;
  }

  async update(
    id: string,
    data: {
      name?: string;
      configuration?: any;
      totalPrice?: number;
    },
  ) {
    await this.findOne(id);

    return this.prisma.savedDesign.update({
      where: { id },
      data: {
        name: data.name,
        configuration: data.configuration,
        totalPrice: data.totalPrice,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.savedDesign.delete({
      where: { id },
    });
  }
}
