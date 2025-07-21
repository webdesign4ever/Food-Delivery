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
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';
import { CustomersModule } from './customers/customers.module';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { ContactModule } from './contact/contact.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [UsersModule, BagTypesModule, ProductsModule, OrdersModule, CustomersModule, ContactModule, StatsModule],
  controllers: [AppController, UsersController, BagTypesController, ProductsController, OrdersController, CustomersController, ContactController, StatsController],
  providers: [AppService, UsersService, BagTypesService, ProductsService, OrdersService, CustomersService, ContactService, StatsService],
})
export class AppModule { }
