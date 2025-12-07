import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {jwtSecret} from './constants';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: {expiresIn: '12h'},
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
}
