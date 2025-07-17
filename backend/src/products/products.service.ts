import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src';
import { products, type InsertProduct, type Product } from 'src/db/schema';

@Injectable()
export class ProductsService {
    async getProducts(): Promise<Product[]> {
        return await db.select().from(products).orderBy(products.category, products.name);
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        return await db.select().from(products).where(eq(products.category, category)).orderBy(products.name);
    }

    async getAvailableProducts(): Promise<Product[]> {
        return await db.select().from(products).where(eq(products.isAvailable, true)).orderBy(products.category, products.name);
    }

    async createProduct(product: InsertProduct): Promise<Product> {
        const [newProduct] = await db.insert(products).values(product).returning();
        return newProduct;
    }

    async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
        const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
        return updated || undefined;
    }

    async deleteProduct(id: number): Promise<boolean> {
        const result = await db.delete(products).where(eq(products.id, id));
        return result.rowCount > 0;
    }
}
