import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { db } from 'src';
import { contactMessages, type ContactMessage, type InsertContactMessage } from 'src/db/schema';

@Injectable()
export class ContactService {

    async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
        const [newMessage] = await db.insert(contactMessages).values(message).returning();
        return newMessage;
    }

    async getContactMessages(): Promise<ContactMessage[]> {
        return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    }

    async markMessageAsReplied(id: number): Promise<ContactMessage | undefined> {
        const [updated] = await db.update(contactMessages).set({ isReplied: true }).where(eq(contactMessages.id, id)).returning();
        return updated || undefined;
    }
}
