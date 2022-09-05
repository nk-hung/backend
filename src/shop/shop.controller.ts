import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateShoeDto } from 'src/shared/dtos/create-shoe.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('all')
  getAll(@Query() param?: { page: string; limit: string; keyword: string }) {
    console.log('query:', param);
    return this.shopService.getAll(param);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.shopService.getById(id);
  }

  @Post('create')
  create(@Body() shoeDto: CreateShoeDto) {
    console.log('data:', shoeDto);
    return this.shopService.create(shoeDto);
  }
}
