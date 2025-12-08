import {Body, Controller, Delete, Get, Header, Param, Post, Query, UseGuards} from '@nestjs/common';
import {FlightsService} from './flights.service';
import {CreateFlightDto} from "./dto/create-flight.dto";
import {AdminGuard} from "../auth/admin.guard";

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {
    }

    @Get()
    async findAll() {
        return await this.flightsService.findAll();
    }

    // @Header('Content-Type', 'application/json')
    @Get('search')
    async search(
        @Query('origin') origin: string,
        @Query('destination') destination: string,
        @Query('date') date: string,
    ) {
        return await this.flightsService.search(origin, destination, date);
    }

    @Get('/by-id/:id')
    async findOne(@Param('id') id: string) {
        return await this.flightsService.findOne(+id);
    }

    @Get('origins')
    async getOrigins(): Promise<string> {
        return await this.flightsService.getOrigins();
    }

    @Get('destinations')
    async getDestinations(@Query('origin') origin: string) {
        return await this.flightsService.getDestinations(origin);
    }

    @Get('dates')
    async getDates(@Query('origin') origin: string, @Query('destination') destination: string) {
        return await this.flightsService.getDates(origin, destination);
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() data: CreateFlightDto[]) {
        return await this.flightsService.create(data);
    }

    @UseGuards(AdminGuard)
    @Delete('/by-id/:id')
    async delete(@Param('id') id: string) {
        return await this.flightsService.remove(+id);
    }
}
