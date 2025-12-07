import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Reservation} from "../reservations/reservation.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({default: 'agent'})
    role: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    passwordHash: string;

    @Column({default: true})
    isActive: boolean;

    @OneToMany(type => Reservation, reservation => reservation.agent)
    reservations: Reservation[];
}
