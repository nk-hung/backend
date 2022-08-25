import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/shared/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private confjg: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }

        return error;
      }
    }
  }

  async signin(dto: AuthDto) {
    const { email, password } = dto;
    // find user in db
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    // if user does not exist, throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    //compare password
    const pwMatches = await bcrypt.compare(password, user.hash);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials inCorrect!');
    }

    return this.signToken(user.id, user.email);
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.confjg.get('JWT_SECRET');
    const access_token = this.jwtService.signAsync(payload, {
      expiresIn: '60s',
      secret,
    });

    return access_token;
  }
}
