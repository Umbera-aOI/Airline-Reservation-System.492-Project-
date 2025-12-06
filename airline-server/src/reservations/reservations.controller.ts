import {Controller, Get, Post, Body, Query} from '@nestjs/common';
import {ReservationsService} from './reservations.service';
import {CreateReservationDto} from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {
    }

    @Post()
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(createReservationDto);
    }

    @Get()
    findOne(@Query('confirmationCode') confirmationCode: string, @Query('lastName') lastName: string) {
        return this.reservationsService.findConfirmation(confirmationCode, lastName);
    }
}
