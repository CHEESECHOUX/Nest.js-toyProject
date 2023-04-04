import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO, SignInResponseDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async login(authDto: AuthDTO): Promise<SignInResponseDto> {
        const { email, password } = authDto;

        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new UnauthorizedException('해당 이메일을 찾을 수 없습니다');
        }
        if (user && user.password !== password) {
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요');
        }
        const payload = { username: user.name };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
