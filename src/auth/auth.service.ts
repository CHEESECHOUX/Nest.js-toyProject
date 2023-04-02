import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async login(authDto: AuthDTO): Promise<any> {
        const { email, password } = authDto;
        const user = await this.usersService.findOne(email);
        if (user && user.password === password) {
            const payload = { username: user.name };
            return {
                accessToken: await this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException('이메일, 비밀번호를 다시 확인해주세요');
        }
    }
}
