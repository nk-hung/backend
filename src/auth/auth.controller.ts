import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDto } from 'src/shared/dtos/auth.dto';
import { CreateUserDto } from 'src/shared/dtos/create-user.dto';
import { Tokens } from 'src/shared/types/tokens.type';
import { AuthService } from './auth.service';
import { JwtAtGuard, JwtRtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  // @UseGuards(JwtAtGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    console.log('req:', req.user);
    // return this.authService.logout(req.user['sub']);
    return 'logout';
  }

  @Post('refresh')
  refresh() {
    return 'refresh';
  }
}
