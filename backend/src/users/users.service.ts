import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src';
import { users, type InsertUser, type User, } from 'src/db/schema';

@Injectable()
export class UsersService {
    async create(insertUser: InsertUser): Promise<User> {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
    }

    async getById(id: number): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
    }
}
