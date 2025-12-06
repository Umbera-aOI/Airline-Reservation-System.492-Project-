import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {And, LessThan, MoreThanOrEqual, Repository} from 'typeorm';
import {Flight} from './flight.entity';
import dayjs from 'dayjs';

@Injectable()
export class FlightsService {
    constructor(
        @InjectRepository(Flight)
        private flightsRepository: Repository<Flight>,
    ) {
    }

    findAll(): Promise<Flight[]> {
        return this.flightsRepository.find();
    }

    search(origin: string, destination: string, date: string): Promise<Flight[]> {
        const asDayjs = dayjs(date).startOf('day')
        return this.flightsRepository.createQueryBuilder('flight')
            .leftJoin('flight.reservations', 'reservation')
            .where('flight.origin = :origin', {origin})
            .andWhere('flight.destination = :destination', {destination})
            .andWhere('flight.date < :endOfDay', {endOfDay: asDayjs.endOf('day').toDate()})
            .andWhere('flight.date >= :beginningOfDay', {beginningOfDay: asDayjs.toDate()})
            .groupBy('flight.id')
            .having('flight.seatsAvailable > COUNT(reservation.id)')
            .getMany()
    }

    findOne(id: number): Promise<Flight | null> {
        return this.flightsRepository.findOneBy({id});
    }

    async getOrigins(): Promise<string> {
        return JSON.stringify(
            await this.flightsRepository.createQueryBuilder('flights')
                .select('origin').distinct()
                .execute()
                .then(res => res.map(f => f.origin))
        );
    }

    async getDestinations(origin: String | undefined): Promise<string> {
        let query = this.flightsRepository.createQueryBuilder('flights')
            .select('destination').distinct();

        if (origin) {
            query = query.where('origin = :origin', {origin});
        }
        return JSON.stringify(
            await query
                .execute()
                .then(res => res.map(f => f.destination))
        );
    }

    async remove(id: number): Promise<void> {
        await this.flightsRepository.delete(id);
    }

    create(data: object): Promise<Flight> {
        const flight = this.flightsRepository.create(data);
        return this.flightsRepository.save(flight);
    }
}
