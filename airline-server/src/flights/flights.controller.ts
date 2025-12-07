import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {FlightsService} from './flights.service';
import {CreateFlightDto} from "./dto/create-flight.dto";
import {AdminGuard} from "../auth/admin.guard";

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {
    }

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

    @Get('/by-id/:id')
    findOne(@Param('id') id: string) {
        return this.flightsService.findOne(+id);
    }

    @Get('origins')
    async getOrigins(): Promise<string> {
        return await this.flightsService.getOrigins();
    }

    @Get('destinations')
    async getDestinations(@Query('origin') origin: string): Promise<string> {
        return await this.flightsService.getDestinations(origin);
    }

    @Get('dates')
    async getDates(@Query('origin') origin: string, @Query('destination') destination: string): Promise<string> {
        return await this.flightsService.getDates(origin, destination);
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() data: CreateFlightDto[]): Promise<string> {
        const flight = await this.flightsService.create(data);
        return JSON.stringify(flight);
    }
}
