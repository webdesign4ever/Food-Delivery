import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { BagTypesController } from './bag-types/bag-types.controller';
import { BagTypesModule } from './bag-types/bag-types.module';
import { BagTypesService } from './bag-types/bag-types.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, BagTypesModule, ProductsModule],
  controllers: [AppController, UsersController, BagTypesController, ProductsController],
  providers: [AppService, UsersService, BagTypesService, ProductsService],
})
export class AppModule { }
