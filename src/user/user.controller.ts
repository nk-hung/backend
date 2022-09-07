import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/:id')
  @UseGuards(JwtGuard)
  getInfo(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
