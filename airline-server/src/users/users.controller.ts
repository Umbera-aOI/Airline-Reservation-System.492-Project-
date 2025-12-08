import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {AdminGuard} from "../auth/admin.guard";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @UseGuards(AdminGuard)
    @Get('agent-statistics')
    async getProfile(@Request() req) {
        return this.usersService.getAgentStatistics();
    }

}
