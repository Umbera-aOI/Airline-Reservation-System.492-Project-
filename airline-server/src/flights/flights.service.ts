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
        return this.flightsRepository.find({
            where: {
                origin, destination,
                date: And(
                    LessThan(asDayjs.endOf('day').toDate()),
                    MoreThanOrEqual(asDayjs.toDate())
                )
            }
        });
    }

    findOne(id: number): Promise<Flight | null> {
        return this.flightsRepository.findOneBy({id});
    }

    getOrigins(): Promise<string[]> {
        return this.flightsRepository.query("SELECT DISTINCT origin FROM flight")
            .then(res => res.map(f => f.origin));
    }

    getDestinations(origin: String | undefined): Promise<string[]> {
        if (origin) {
            return this.flightsRepository.query("SELECT DISTINCT destination FROM flight WHERE origin = $1", [origin])
                .then(res => res.map(f => f.destination));
        } else {
            return this.flightsRepository.query("SELECT DISTINCT destination FROM flight")
                .then(res => res.map(f => f.destination));
        }
    }

    async remove(id: number): Promise<void> {
        await this.flightsRepository.delete(id);
    }

    create(data: object): Promise<Flight> {
        const flight = this.flightsRepository.create(data);
        return this.flightsRepository.save(flight);
    }
}
