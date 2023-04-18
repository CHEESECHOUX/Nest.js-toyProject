import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { CreateUserDTO, LogInDTO, SignInResponseDto } from '@src/auth/dto/auth.dto';
import { User } from '@src/users/user.entity';
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.authService.signUp(createUserDTO);
    }

    @Post('/login')
    async login(@Body() logInDTO: LogInDTO): Promise<SignInResponseDto> {
        return this.authService.login(logInDTO);
    }
}
