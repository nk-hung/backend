import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @Get('info')
  @UseGuards(JwtGuard)
  getInfo() {
    return 'Infomation User';
  }
}
