import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/strategy';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  controllers: [BookController],
  providers: [BookService, JwtStrategy],
})
export class BookModule {}
