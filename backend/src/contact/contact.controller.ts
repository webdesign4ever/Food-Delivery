import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    @Post()
    async createContactMessage(@Body() body: any) {
        try {
            const newMessage = await this.contactService.createContactMessage(body);
            return newMessage;
        } catch (error) {
            throw new HttpException({ message: 'Invalid contact message data' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getContactMessages() {
        try {
            return await this.contactService.getContactMessages();
        } catch (error) {
            throw new HttpException({ message: 'Failed to fetch contact messages' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id/reply')
    async markAsReplied(@Param('id', ParseIntPipe) id: number) {
        try {
            const updatedMessage = await this.contactService.markMessageAsReplied(id);
            if (!updatedMessage) {
                throw new NotFoundException({ message: `Contact message with id ${id} not found`, });
            }
            return updatedMessage;
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new HttpException({ message: 'Failed to mark message as replied' }, HttpStatus.BAD_REQUEST);
        }
    }

}
