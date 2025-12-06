import {Injectable} from '@nestjs/common';
import {CreateReservationDto} from './dto/create-reservation.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Reservation} from "./reservation.entity";
import {Flight} from "../flights/flight.entity";

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
        @InjectRepository(Flight)
        private flightsRepository: Repository<Flight>,
    ) {
    }

    async create(createReservationDto: CreateReservationDto) {
        const reservation = {
            ...createReservationDto,
            flight: await this.flightsRepository.findOneByOrFail({id: createReservationDto.flightId}),
            confirmationCode: Math.random().toString(36).substring(2, 7).toUpperCase()
        }
        const saved = await this.reservationsRepository.save(
            this.reservationsRepository.create(reservation)
        );
        return JSON.stringify({...saved, flight: saved.flight});
    }

    async findConfirmation(confirmationCode: string, lastName: string) {
        return JSON.stringify(await this.reservationsRepository.findOneByOrFail({confirmationCode, lastName}));
    }
}
