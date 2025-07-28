import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BagTypesService } from './bag-types.service';
import { BagType } from 'src/db/schema';

@Controller('bag-types')
export class BagTypesController {
    constructor(private bagTypesService: BagTypesService) { }

    @Post()
    async create(@Body() body: any) {
        try {
            return this.bagTypesService.create(body);
        } catch {
            throw new HttpException({ message: 'Invalid bag type data' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    findAll() {
        try {
            return this.bagTypesService.findAll();
        } catch {
            throw new HttpException({ message: 'Failed to fetch box types' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<BagType> {
        try {
            const updated = await this.bagTypesService.update(id, body);

            if (!updated) {
                throw new NotFoundException({ message: `BagType with id ${id} not found` });
            }

            return updated;
        } catch {
            throw new HttpException({ message: 'Failed to update bag type' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async deleteBag(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.bagTypesService.deleteBag(id);
            if (!deleted) {
                throw new NotFoundException({ message: 'Bag not found' });
            }
            return { message: 'Bag deleted successfully' };
        } catch (err) {
            console.log(err)
            if (err instanceof NotFoundException) throw err;
            throw new HttpException({ message: 'Failed to delete bag' }, HttpStatus.BAD_REQUEST);
        }
    }
}
