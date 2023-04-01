import { Injectable } from '@nestjs/common';
import { AuthDTO, SignInResponseDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    #secret: string;

    constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
        this.#secret = this.configService.get('JWT_SECRET')!;
    }

    async login({ email, password }: AuthDTO): Promise<SignInResponseDto> {
        // TODO
        // email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
        const accessToken = await this.jwtService.signAsync({ userId: 1 }, { secret: this.#secret });

        return { accessToken };
    }
}
