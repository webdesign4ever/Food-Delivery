import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CustomersService } from 'src/customers/customers.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, CustomersService],
})
export class OrdersModule { }
