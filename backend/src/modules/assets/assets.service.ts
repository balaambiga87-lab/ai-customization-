import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryCode?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryCode) {
      where.category = {
        code: query.categoryCode,
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.jewelleryAsset.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
      }),
      this.prisma.jewelleryAsset.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findCategories() {
    return this.prisma.assetCategory.findMany();
  }
}
