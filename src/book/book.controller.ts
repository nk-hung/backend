import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookDto } from 'src/shared/dtos/book.dto';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('')
  getAll() {
    return this.bookService.getAll();
  }

  @Get('/:id')
  getById(@Param() id: string) {
    return this.bookService.getById(id);
  }

  @Post()
  create(@Body() data: BookDto) {
    return this.bookService.create(data);
  }
}
