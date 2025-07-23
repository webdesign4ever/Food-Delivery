import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CustomersService } from 'src/customers/customers.service';
import { InsertOrderItem } from 'src/db/schema';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
        private customersService: CustomersService,
    ) { }

    @Post()
    async createOrder(@Body() body: any) {
        try {
            // 1️⃣ Get or create customer
            let customer = await this.customersService.getCustomerByEmail(body.customer.email);
            if (!customer) {
                customer = await this.customersService.createCustomer(body.customer);
            }

            // 2️⃣ Create order
            const order = await this.ordersService.createOrder({
                customerId: customer.id,
                bagTypeId: body.bagTypeId,
                totalAmount: body.totalAmount,
                paymentMethod: body.paymentMethod,
                specialInstructions: body.specialInstructions,
                orderStatus: 'processing',
                paymentStatus: 'pending',
            });

            // 3️⃣ Create order items
            const orderItemsData: InsertOrderItem[] = body.items.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            }));
            await this.ordersService.createOrderItems(orderItemsData);

            return order;
        } catch (error) {
            console.error('Order creation error:', error);
            throw new HttpException({ message: 'Failed to create order' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getOrders() {
        try {
            return await this.ordersService.getOrders();
        } catch (error) {
            throw new HttpException({ message: 'Failed to fetch orders' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getOrderById(@Param('id', ParseIntPipe) id: number) {
        try {
            const order = await this.ordersService.getOrderById(id);
            if (!order) {
                throw new HttpException({ message: 'Order not found' }, HttpStatus.NOT_FOUND);
            }
            return order;
        } catch (error) {
            throw new HttpException({ message: 'Failed to fetch order' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id/status')
    async updateOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,) {
        try {
            const updatedOrder = await this.ordersService.updateOrderStatus(id, body.status);
            if (!updatedOrder) {
                throw new HttpException({ message: 'Order not found' }, HttpStatus.NOT_FOUND);
            }
            return updatedOrder;
        } catch (error) {
            throw new HttpException({ message: 'Failed to update order status' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id/payment')
    async updatePaymentStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,) {
        try {
            const updatedOrder = await this.ordersService.updatePaymentStatus(id, body.status);
            if (!updatedOrder) {
                throw new HttpException({ message: 'Order not found' }, HttpStatus.NOT_FOUND);
            }
            return updatedOrder;
        } catch (error) {
            throw new HttpException({ message: 'Failed to update payment status' }, HttpStatus.BAD_REQUEST);
        }
    }

}
