import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LogInDTO, SignInResponseDto, UserInfo } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { User } from 'src/users/user.entity';
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo | undefined> {
        console.log(userId);
        return;
    }

    @Post('/signup')
    async signup(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.authService.signUp(createUserDTO);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('/login')
    async login(@Body() logInDTO: LogInDTO): Promise<SignInResponseDto> {
        return this.authService.login(logInDTO);
    }
}
