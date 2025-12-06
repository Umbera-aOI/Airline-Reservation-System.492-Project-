import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Reservation} from "../reservations/reservation.entity";

@Entity()
export class Flight {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column()
    date: Date;

    @Column()
    price: number;

    @Column({default: 'FL123'})
    flightCode: string;

    @Column({default: 10})
    seatsAvailable: number;

    @OneToMany(type => Reservation, reservation => reservation.flight)
    reservations: Reservation[];
}
