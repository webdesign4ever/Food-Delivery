import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/db/schema';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async create(@Body() body: any) {
        return this.usersService.create(body);
    }

    // Get user by ID
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.usersService.getById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // Get user by username
    @Get('username/:username')
    async getByUsername(@Param('username') username: string): Promise<User> {
        const user = await this.usersService.getUserByUsername(username);
        if (!user) {
            throw new NotFoundException(`User with username '${username}' not found`);
        }
        return user;
    }
}
