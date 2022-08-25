import { Module } from '@nestjs/common';
import { ServiceController } from './service/service.controller';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  controllers: [ServiceController, ShopController],
  providers: [ShopService]
})
export class ShopModule {}
