import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src';
import { bagCustomizableItems, bagFixedItems, bagTypes, type BagType, type InsertBagType } from 'src/db/schema';

@Injectable()
export class BagTypesService {
    async create(bagType: any): Promise<any> {
        const { fixedItems = [], customizableItems = [], ...bagTypeData } = bagType;

        // Create bag type
        const [newBag] = await db.insert(bagTypes).values(bagTypeData).returning();

        // Insert fixed items
        if (fixedItems.length) {
            await db.insert(bagFixedItems).values(
                fixedItems.map((productId: number) => ({
                    bagTypeId: newBag.id,
                    productId,
                }))
            );
        }

        // Insert customizable items
        if (customizableItems.length) {
            await db.insert(bagCustomizableItems).values(
                customizableItems.map((productId: number) => ({
                    bagTypeId: newBag.id,
                    productId,
                }))
            );
        }

        return {
            ...newBag,
            fixedItems,
            customizableItems,
        };
        // const [newBagType] = await db.insert(bagTypes).values(bagType).returning();
        // return newBagType;
    }

    async findAll(): Promise<BagType[]> {
        const bagList = await db.select().from(bagTypes).where(eq(bagTypes.isActive, true)).orderBy(bagTypes.price);

        const enrichedBagList = await Promise.all(
            bagList.map(async (bag) => {
                const fixedItems = await db.select({ productId: bagFixedItems.productId }).from(bagFixedItems).where(eq(bagFixedItems.bagTypeId, bag.id));
                const customizableItems = await db.select({ productId: bagCustomizableItems.productId }).from(bagCustomizableItems).where(eq(bagCustomizableItems.bagTypeId, bag.id));
                return {
                    ...bag,
                    fixedItems: fixedItems.map((item) => item.productId),
                    customizableItems: customizableItems.map((item) => item.productId),
                };
            })
        );

        return enrichedBagList;
        //return await db.select().from(bagTypes).where(eq(bagTypes.isActive, true)).orderBy(bagTypes.price);
    }

    async update(id: number, bagType: any): Promise<any | undefined> {
        const { fixedItems = [], customizableItems = [], ...bagTypeData } = bagType;

        const [updated] = await db.update(bagTypes).set(bagTypeData).where(eq(bagTypes.id, id)).returning();

        if (!updated) return undefined;

        // Remove old items
        await db.delete(bagFixedItems).where(eq(bagFixedItems.bagTypeId, id));
        await db.delete(bagCustomizableItems).where(eq(bagCustomizableItems.bagTypeId, id));

        // Insert new fixed items
        if (fixedItems.length) {
            await db.insert(bagFixedItems).values(
                fixedItems.map((productId: number) => ({
                    bagTypeId: id,
                    productId,
                }))
            );
        }

        // Insert new customizable items
        if (customizableItems.length) {
            await db.insert(bagCustomizableItems).values(
                customizableItems.map((productId: number) => ({
                    bagTypeId: id,
                    productId,
                }))
            );
        }

        return {
            ...updated,
            fixedItems,
            customizableItems,
        };
        // const [updated] = await db.update(bagTypes).set(bagType).where(eq(bagTypes.id, id)).returning();
        // return updated || undefined;
    }

    async deleteBag(id: number): Promise<boolean> {
        const result = await db.delete(bagTypes).where(eq(bagTypes.id, id));
        return result.rowCount > 0;
    }
}
