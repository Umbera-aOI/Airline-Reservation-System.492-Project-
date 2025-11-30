import {TypeOrmModule} from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from "./reservation.entity";
import { Flight } from "../flights/flight.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Flight])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
