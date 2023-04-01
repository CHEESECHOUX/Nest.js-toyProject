import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, SignInResponseDto } from './dto/auth.dto';
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: AuthDTO): Promise<SignInResponseDto> {
        return this.authService.login(dto);
    }
}
