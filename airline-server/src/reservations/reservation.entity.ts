import {Flight} from "../flights/flight.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    confirmationCode: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: false})
    flightId: number;

    @ManyToOne(type => Flight, flight => flight.reservations)
    flight: Flight;
}
