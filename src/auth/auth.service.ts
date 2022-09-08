import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { SUCCESS } from 'src/shared/constants/message';
import { AuthDto } from 'src/shared/dtos/auth.dto';
import { CreateUserDto } from 'src/shared/dtos/create-user.dto';
import { Status } from 'src/shared/enums/statusHttp.enum';
import { Tokens } from 'src/shared/types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private confjg: ConfigService,
  ) {}

  hashedData(data: string) {
    return bcrypt.hash(data, 12);
  }

  async signup(dto: CreateUserDto) {
    const hash = await this.hashedData(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
          hashedRT: null,
        },
      });

      const tokens = await this.getTokens(user.id, user.username); // {access_token, refresh_token}

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      // res.cookie('access_token', tokens.access_token, { httpOnly: true });
      // res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });

      return tokens;
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
    if (!user) throw new ForbiddenException('Credentials incorrect!');
    //compare password
    const pwMatches = await bcrypt.compare(password, user.hash);
    if (!pwMatches) throw new ForbiddenException('Password is incorrect!');

    const tokens = await this.getTokens(user.id, user.username);

    console.log('user login:', user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    // res.cookie('access_token', tokens.access_token, { httpOnly: true });
    // res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });

    return tokens;
  }

  async getTokens(userId: number, username: string) {
    const payload = { sub: userId, username };
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.confjg.get('JWT_ACCESS_SECRET'),
    });

    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.confjg.get('JWT_REFRESH_SECRET'),
    });

    const [access_token, refresh_token] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRT = await this.hashedData(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: {
        hashedRT,
      },
    });
  }

  async logout(id: number) {
    await this.prisma.user.updateMany({
      where: {
        id,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }
}
