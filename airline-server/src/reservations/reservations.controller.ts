import {Controller, Get, Post, Body, Query, UseGuards, Request, Delete} from '@nestjs/common';
import {ReservationsService} from './reservations.service';
import {CreateReservationDto} from './dto/create-reservation.dto';
import {AuthGuard} from "../auth/auth.guard";
import {OptionalGuard} from "../auth/optional.guard";

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {
    }

    @UseGuards(OptionalGuard)
    @Post()
    async create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
        const agentId = req.user?.sub;
        return await this.reservationsService.create(createReservationDto, agentId);
    }

    @Get()
    async findOne(@Query('confirmationCode') confirmationCode: string, @Query('lastName') lastName: string) {
        return await this.reservationsService.findConfirmation(confirmationCode, lastName);
    }

    @Delete()
    async delete(@Query('confirmationCode') confirmationCode: string, @Query('lastName') lastName: string) {
        return await this.reservationsService.deleteByConfirmation(confirmationCode, lastName);
    }

    @UseGuards(AuthGuard)
    @Get('by-agent')
    async getProfile(@Request() req) {
        return await this.reservationsService.findByAgent(req.user.sub);
    }
}
