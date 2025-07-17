import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src';
import { bagTypes, type BagType, type InsertBagType } from 'src/db/schema';

@Injectable()
export class BagTypesService {
    async create(bagType: InsertBagType): Promise<BagType> {
        const [newBagType] = await db.insert(bagTypes).values(bagType).returning();
        return newBagType;
    }

    async findAll(): Promise<BagType[]> {
        return await db.select().from(bagTypes).where(eq(bagTypes.isActive, true)).orderBy(bagTypes.price);
    }

    async update(id: number, bagType: Partial<InsertBagType>): Promise<BagType | undefined> {
        const [updated] = await db.update(bagTypes).set(bagType).where(eq(bagTypes.id, id)).returning();
        return updated || undefined;
    }
}
