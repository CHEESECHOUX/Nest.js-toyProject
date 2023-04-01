import { Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    async login({ email, password }: AuthDTO): Promise<string> {
        // TODO
        // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
        // 2. JWT 발급
        throw new Error('Method not implemented.');
    }
}
