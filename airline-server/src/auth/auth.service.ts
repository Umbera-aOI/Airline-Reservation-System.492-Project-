import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {User} from "../users/user.entity";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {JwtService} from '@nestjs/jwt';
import {AuthResponseDto} from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService) {
    }

    async login(username: string, password: string): Promise<AuthResponseDto> {
        const user = await this.usersService.verifyAndFind(username, password);
        const payload = {sub: user.id, username: user.username, role: user.role};
        return {
            access_token: await this.jwtService.signAsync(payload),
            username,
            role: user.role
        };
    }

    async signup(userParams: CreateUserDto): Promise<AuthResponseDto> {
        const user = await this.usersService.create(userParams);
        const payload = {sub: user.id, username: user.username, role: user.role};
        return {
            access_token: await this.jwtService.signAsync(payload),
            username: user.username,
            role: user.role
        };
    }
}