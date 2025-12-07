import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {User} from "../users/user.entity";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService) {
    }

    async login(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersService.verifyAndFind(username, password);
        const payload = {sub: user.id, username: user.username};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signup(userParams: CreateUserDto): Promise<{ access_token: string }> {
        const user = await this.usersService.create(userParams);
        const payload = {sub: user.id, username: user.username};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}