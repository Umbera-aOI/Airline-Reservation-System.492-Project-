
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FlightsModule } from './flights/flights.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'host.docker.internal',
            port: 5432,
            username: 'airline_user',
            password: 'airline_password',
            database: 'airline_db',
            synchronize: true,
            autoLoadEntities: true,
        }),
        UsersModule,
        FlightsModule,
        ReservationsModule,
        AuthModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule {}
