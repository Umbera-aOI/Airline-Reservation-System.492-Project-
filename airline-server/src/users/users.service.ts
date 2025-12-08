import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import bcrypt from 'bcrypt'
import {User} from './user.entity';
import {CreateUserDto} from "./dto/create-user.dto";
import {AgentStatisticsDto} from "./dto/agent-statistics.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async findOne(username: string): Promise<User> {
        return this.usersRepository.findOneOrFail({
            where: {username},
            select: ['id', 'username', 'firstName', 'lastName', 'role', 'passwordHash']
        });
    }

    async verifyAndFind(username: string, password: string): Promise<User> {
        const user = await this.findOne(username);
        if (!bcrypt.compare(password, user.passwordHash)) {
            throw new Error("Invalid password")
        }
        return user;
    }

    async create(createUserParams: CreateUserDto): Promise<User> {
        let userParams = {
            firstName: createUserParams.firstName,
            lastName: createUserParams.lastName,
            username: createUserParams.username,
            passwordHash: await bcrypt.hash(createUserParams.password, 10)
        }
        const numAdmins = await this.usersRepository.count({where: {role: 'admin'}});
        if (numAdmins == 0) {
            userParams['role'] = 'admin';
        }
        return this.usersRepository.save(this.usersRepository.create(userParams));
    }

    async getAgentStatistics(): Promise<AgentStatisticsDto[]> {
        return this.usersRepository.createQueryBuilder('user')
            .leftJoin('user.reservations', 'reservation')
            .select('user.id', 'id')
            .addSelect('user.username', 'username')
            .addSelect('user.firstName', 'firstName')
            .addSelect('user.lastName', 'lastName')
            .addSelect('COUNT(reservation.id)::INTEGER', 'reservationsCount')
            .addSelect('SUM(reservation.price)::INTEGER', 'reservationsProfit')
            .where("user.role IN ('agent', 'admin')")
            .groupBy('user.id')
            .getRawMany<AgentStatisticsDto>()
    }

    delete(username: string) {
        return this.usersRepository.delete({username});
    }
}
