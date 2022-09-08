import { Injectable, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.book.findMany();
  }

  async getById(id: string) {
    return this.prisma.book.findUnique({
      where: { id: parseInt(id) },
    });
  }

  @UseGuards(JwtGuard)
  async create(data) {
    return this.prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        price: parseInt(data.price),
      },
    });
  }
}
