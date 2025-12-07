import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {And, LessThan, MoreThanOrEqual, Repository} from 'typeorm';
import {Flight} from './flight.entity';
import dayjs from 'dayjs';
import {CreateFlightDto} from "./dto/create-flight.dto";

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
            .select('flight.*')
            .addSelect('COUNT(reservation.id)::INTEGER', 'seatsReserved')
            .where('flight.origin = :origin', {origin})
            .andWhere('flight.destination = :destination', {destination})
            .andWhere('flight.date < :endOfDay', {endOfDay: asDayjs.endOf('day').toDate()})
            .andWhere('flight.date >= :startOfDay', {startOfDay: asDayjs.toDate()})
            .groupBy('flight.id')
            .addGroupBy('reservation.id')
            .having('flight.seatsAvailable > COUNT(reservation.id)')
            .getRawMany()
    }

    findOne(id: number): Promise<Flight | null> {
        return this.flightsRepository.findOneBy({id});
    }

    async getOrigins(): Promise<string> {
        return JSON.stringify(
            await this.flightsRepository.createQueryBuilder('flights')
                .select('origin').distinct()
                .where('date >= :startOfDay', {startOfDay: dayjs().startOf('day').toDate()})
                .execute()
                .then(res => res.map(f => f.origin))
        );
    }

    async getDestinations(origin: String | undefined): Promise<string> {
        let query = this.flightsRepository.createQueryBuilder('flights')
            .select('destination').distinct()
            .where('date >= :startOfDay', {startOfDay: dayjs().startOf('day').toDate()});

        if (origin) {
            query = query.andWhere('origin = :origin', {origin});
        }
        return JSON.stringify(
            await query
                .execute()
                .then(res => res.map(f => f.destination))
        );
    }

    async getDates(origin: String | undefined, destination: String | undefined): Promise<string> {
        let query = this.flightsRepository.createQueryBuilder('flights')
            .select('date').distinct()
            .where('date >= :startOfDay', {startOfDay: dayjs().startOf('day').toDate()});

        if (origin) {
            query = query.andWhere('origin = :origin', {origin});
        }
        if (destination) {
            query = query.andWhere('destination = :destination', {destination});
        }
        const dates = await query.execute();
        let days = {};
        dates.forEach(d => days[dayjs(d.date).format('YYYY-MM-DD')] = true);
        return JSON.stringify(Object.keys(days));
    }

    async remove(id: number): Promise<void> {
        await this.flightsRepository.delete(id);
    }

    create(data: CreateFlightDto[]): Promise<Flight[]> {
        const flight = this.flightsRepository.create(data);
        return this.flightsRepository.save(flight);
    }
}
