import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShoeDto } from 'src/shared/dtos/create-shoe.dto';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: { page: string; limit: string; keyword: string }) {
    console.log('query in service:', query);
    const take = parseInt(query.limit);
    const skip = (parseInt(query.page) - 1) * take;
    const result = await this.prisma.shoe.findMany({
      skip,
      take,
      where: {
        name: {
          contains: query.keyword,
        },
      },
    });
    return result;
  }

  async getById(id: string) {
    const result = await this.prisma.shoe.findUnique({
      where: { id: parseInt(id) },
    });
    console.log('id:', id);
    return result;
  }

  async create(data: CreateShoeDto) {
    const shoe = await this.prisma.shoe.create({
      data,
    });
    console.log('shoe:', shoe);
    return shoe;
  }
}
