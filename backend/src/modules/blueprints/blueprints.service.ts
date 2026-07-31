import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BlueprintsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blueprint.findMany({
      where: { isActive: true },
      include: { anchors: true },
    });
  }

  async findOne(id: string) {
    const bp = await this.prisma.blueprint.findUnique({
      where: { id },
      include: { anchors: true },
    });
    if (!bp) throw new NotFoundException(`Blueprint with ID "${id}" not found.`);
    return bp;
  }

  async findAnchors(blueprintId: string) {
    return this.prisma.blueprintAnchor.findMany({
      where: { blueprintId },
    });
  }
}
