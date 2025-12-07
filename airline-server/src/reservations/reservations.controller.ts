import {Controller, Get, Post, Body, Query, UseGuards, Request} from '@nestjs/common';
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
    create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
        const agentId = req.user?.sub;
        return this.reservationsService.create(createReservationDto, agentId);
    }

    @Get()
    findOne(@Query('confirmationCode') confirmationCode: string, @Query('lastName') lastName: string) {
        return this.reservationsService.findConfirmation(confirmationCode, lastName);
    }

    @UseGuards(AuthGuard)
    @Get('by-agent')
    async getProfile(@Request() req) {
        console.log(req.user);
        return this.reservationsService.findByAgent(req.user.sub);
    }
}
