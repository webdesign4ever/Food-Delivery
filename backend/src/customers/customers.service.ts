import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src';
import { customers, type Customer, type InsertCustomer } from 'src/db/schema';

@Injectable()
export class CustomersService {

    async createCustomer(customer: InsertCustomer): Promise<Customer> {
        const [newCustomer] = await db.insert(customers).values(customer).returning();
        return newCustomer;
    }

    async getCustomerByEmail(email: string): Promise<Customer | undefined> {
        const [customer] = await db.select().from(customers).where(eq(customers.email, email));
        return customer || undefined;
    }
}
