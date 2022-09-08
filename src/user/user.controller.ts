import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAtGuard)
  @Get('info')
  getInfo() {
    return this.userService.getUser();
  }
}
