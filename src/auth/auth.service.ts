import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO, LogInDTO, SignInResponseDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeOrm';
import { InjectRepository } from '@nestjs/typeOrm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signUp(createUserDTO: CreateUserDTO): Promise<User> {
        const { name, email, password } = createUserDTO;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;

        try {
            await this.usersRepository.save(user);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('이미 존재하는 이메일입니다');
            } else {
                throw error;
            }
        }
        return user;
    }

    async login(logInDTO: LogInDTO): Promise<SignInResponseDto> {
        const { email, password } = logInDTO;

        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('해당 이메일을 찾을 수 없습니다');
        }
        if (user && !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요');
        }

        const payload = { email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
}
