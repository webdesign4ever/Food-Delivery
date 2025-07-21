import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src';
import { customers, orders, products } from 'src/db/schema';

@Injectable()
export class StatsService {

    async getOrderStats(): Promise<{ totalOrders: number; totalRevenue: string; totalCustomers: number; totalProducts: number }> {
        const [orderStats] = await db.select({
            totalOrders: sql<number>`count(*)`,
            totalRevenue: sql<string>`sum(${orders.totalAmount})`,
        }).from(orders);

        const [customerCount] = await db.select({
            totalCustomers: sql<number>`count(*)`,
        }).from(customers);

        const [productCount] = await db.select({
            totalProducts: sql<number>`count(*)`,
        }).from(products);

        return {
            totalOrders: orderStats.totalOrders || 0,
            totalRevenue: orderStats.totalRevenue || "0",
            totalCustomers: customerCount.totalCustomers || 0,
            totalProducts: productCount.totalProducts || 0,
        };
    }
}
