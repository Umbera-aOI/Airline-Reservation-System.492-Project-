import {BadRequestException, Injectable} from '@nestjs/common';
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

    async create(createReservationDto: CreateReservationDto, agentId?: number) {
        const flight = await this.flightsRepository.createQueryBuilder('flight')
            .leftJoin('flight.reservations', 'reservation')
            .select('flight.*')
            .addSelect('COUNT(reservation.id)::INTEGER', 'seatsReserved')
            .where('flight.id = :id', {id: createReservationDto.flightId})
            .groupBy('flight.id')
            .addGroupBy('reservation.id')
            .getRawOne();

        if (flight.seatsReserved >= flight.seatsAvailable) throw new BadRequestException(
            `Flight ${flight.flightCode} is full`
        );
        const reservation = {
            ...createReservationDto,
            agentId,
            flight: flight,
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

    async findByAgent(agentId: number) {
        return JSON.stringify(
            await this.reservationsRepository.findBy({agentId})
        );
    }
}
