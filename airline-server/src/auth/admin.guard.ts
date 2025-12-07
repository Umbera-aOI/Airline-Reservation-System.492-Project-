import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {jwtSecret} from './constants';
import {Request} from 'express';
import {UsersService} from "../users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService, private usersService: UsersService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            request['user'] = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtSecret
                });
        } catch {
            throw new UnauthorizedException();
        }
        const user = await this.usersService.findOne(request['user'].username);
        if (user.role != 'admin') {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
