import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

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
}
