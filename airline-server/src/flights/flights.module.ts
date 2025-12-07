import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FlightsService} from './flights.service';
import {FlightsController} from './flights.controller';
import {Reservation} from "../reservations/reservation.entity";
import {Flight} from "./flight.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Flight, Reservation]), UsersModule],
    providers: [FlightsService],
    controllers: [FlightsController],
})
export class FlightsModule {
}
