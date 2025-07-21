import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { db } from 'src';
import { orders, orderItems, type Order, type InsertOrder, type InsertOrderItem, type OrderItem, type BagType, type Product, type Customer, } from 'src/db/schema';

@Injectable()
export class OrdersService {

    async createOrder(order: InsertOrder): Promise<Order> {
        const [newOrder] = await db.insert(orders).values(order).returning();
        return newOrder;
    }

    async createOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]> {
        return await db.insert(orderItems).values(orderItemsData).returning();
    }

    async getOrders(): Promise<(Order & { customer: Customer; bagType: BagType; orderItems: (OrderItem & { product: Product })[] })[]> {
        const ordersWithDetails = await db.query.orders.findMany({
            with: {
                customer: true,
                bagType: true,
                orderItems: {
                    with: {
                        product: true,
                    },
                },
            },
            orderBy: [desc(orders.createdAt)],
        });
        return ordersWithDetails;
    }

    async getOrderById(id: number): Promise<(Order & { customer: Customer; bagType: BagType; orderItems: (OrderItem & { product: Product })[] }) | undefined> {
        const orderWithDetails = await db.query.orders.findFirst({
            where: eq(orders.id, id),
            with: {
                customer: true,
                bagType: true,
                orderItems: {
                    with: {
                        product: true,
                    },
                },
            },
        });
        return orderWithDetails || undefined;
    }

    async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
        const [updated] = await db.update(orders).set({ orderStatus: status }).where(eq(orders.id, id)).returning();
        return updated || undefined;
    }

    async updatePaymentStatus(id: number, status: string): Promise<Order | undefined> {
        const [updated] = await db.update(orders).set({ paymentStatus: status }).where(eq(orders.id, id)).returning();
        return updated || undefined;
    }
}
