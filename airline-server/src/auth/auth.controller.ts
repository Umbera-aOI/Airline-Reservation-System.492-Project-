import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
    Request, Delete
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from "./dto/login.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthGuard} from "./auth.guard";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.username);
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role
        };
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    deleteProfile(@Request() req) {
        return this.usersService.delete(req.user.username);
    }
}
