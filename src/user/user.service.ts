import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUser() {
    // const user = await this.prisma.user.findUnique({
    //   where: { id: parseInt(id) },
    // });
    // return user;

    return 'user info';
  }
}
