import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) { }

    @Get()
    async getOrderStats() {
        try {
            return await this.statsService.getOrderStats();
        } catch (error) {
            throw new HttpException({ message: 'Failed to fetch statistics' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
