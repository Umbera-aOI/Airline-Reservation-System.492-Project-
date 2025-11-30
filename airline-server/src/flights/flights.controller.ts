
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {}
    @Get()
    async findAll(): Promise<string> {
        return JSON.stringify(await this.flightsService.findAll());
    }
    @Get('search')
    async search(
        @Query('origin') origin: string,
        @Query('destination') destination: string,
        @Query('date') date: string,
    ): Promise<string> {
        return JSON.stringify(await this.flightsService.search(origin, destination, date));
    }
    @Post()
    async create(@Body() data: object): Promise<string> {
        const flight = await this.flightsService.create(data);
        return JSON.stringify(flight);
    }
}
