import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UsersInfoDTO } from './dto/users.dto';
import { AuthUser, AuthUserType } from 'src/common/decorators/users.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getUserInfo(@AuthUser('id') authUserType: AuthUserType): Promise<UsersInfoDTO | null> {
        const userInfo = await this.usersService.getUserInfo(authUserType);
        return userInfo;
    }
}
