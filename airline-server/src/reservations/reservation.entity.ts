import {Flight} from "../flights/flight.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";

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

    @Column({default: 22500})
    price: number;

    @Column()
    flightId: number;

    @Column({nullable: true})
    agentId: number;

    @ManyToOne(type => Flight, flight => flight.reservations)
    flight: Flight;

    @ManyToOne(type => User, agent => agent.reservations)
    agent: User;
}
