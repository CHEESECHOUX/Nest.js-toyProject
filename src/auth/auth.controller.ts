import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, SignInResponseDto } from './dto/auth.dto';
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
    @Post('/login')
    async login(@Body() authDto: AuthDTO): Promise<SignInResponseDto> {
        return this.authService.login(authDto);
    }
}
