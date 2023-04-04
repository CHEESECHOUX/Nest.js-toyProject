import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, SignInResponseDto, UserInfo } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo | undefined> {
        console.log(userId);
        return;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/login')
    async login(@Body() authDto: AuthDTO): Promise<SignInResponseDto> {
        return this.authService.login(authDto);
    }
}
