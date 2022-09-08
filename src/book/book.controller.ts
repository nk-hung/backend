import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAtGuard, JwtGuard } from 'src/auth/guard';
import { BookDto } from 'src/shared/dtos/book.dto';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAll() {
    return this.bookService.getAll();
  }

  // @UseGuards(JwtAtGuard)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.bookService.getById(id);
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: BookDto) {
    return this.bookService.create(data);
  }
}
