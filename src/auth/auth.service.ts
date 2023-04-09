import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO, SignInResponseDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signUp(authDto: AuthDTO): Promise<User> {
        const { name, email, password } = authDto;

        // const saltOrRounds = 10;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;

        try {
            await this.usersRepository.save(user);
            console.log(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('이미 존재하는 이메일입니다');
            } else {
                throw error;
            }
        }
        return user;
    }

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
