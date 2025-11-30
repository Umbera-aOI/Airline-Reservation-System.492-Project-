
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
