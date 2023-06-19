import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/auth/auth.service';
import { User } from '@src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, SignInResponseDto } from '@src/auth/dto/auth.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TestAppModule } from '@src/test-app.module';
import { JwtService } from '@nestjs/jwt';
import { LogInDTO } from '@src/auth/dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';

describe('AuthService', () => {
    let usersRepository: Repository<User>;
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [TestAppModule],
            providers: [
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(async () => {
        await usersRepository.delete({ email: 'jisoo@test.com' });
    });

    afterAll(async () => {
        await module.close();
    });

    describe('signUp', () => {
        let createUserDTO;

        beforeEach(async () => {
            // Given
            createUserDTO = new CreateUserDTO();
            createUserDTO.name = 'jisoo';
            createUserDTO.email = 'jisoo@test.com';
            createUserDTO.password = 'password';

            const salt = await bcrypt.genSalt();
            jest.spyOn(bcrypt, 'hash');

            const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

            const user = new User();
            user.name = createUserDTO.name;
            user.email = createUserDTO.email;
            user.password = hashedPassword;

            await usersRepository.save(user);

            // Then
            const savedUser = await usersRepository.findOne({ where: { email: createUserDTO.email } });

            expect(savedUser).toEqual(user);
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDTO.password, salt);
        });

        it('should create a new user', async () => {
            // When
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(new User());

            await expect(authService.signUp(createUserDTO)).rejects.toThrowError('이미 존재하는 이메일입니다');
        });
    });

    describe('login', () => {
        // describe 함수는 동기적으로 실행 async 사용할 수 없음
        const logInDTO: LogInDTO = {
            email: 'jisoo@test.com',
            password: 'hashedPassword',
        };

        let user;

        beforeEach(async () => {
            // Given
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(logInDTO.password, salt);

            user = new User();
            user.email = logInDTO.email;
            user.password = hashedPassword;

            await usersRepository.save(user);
        });

        it('should throw UnauthorizedException if email is not found', async () => {
            // When
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

            // Then
            await expect(authService.login(logInDTO)).rejects.toThrow(UnauthorizedException);
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(logInDTO.email);
        });

        it('should throw UnauthorizedException if password is not correct', async () => {
            // Given
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user); // 해당하는 유저를 찾았다고 가정
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false)); // 비밀번호가 틀렸다고 가정

            // When/Then
            await expect(authService.login(logInDTO)).rejects.toThrow(UnauthorizedException);
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(logInDTO.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(logInDTO.password, user.password);
        });

        it('should return SignInResponseDto if login success', async () => {
            // Given
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation((password: string, correctPassword: string) => {
                return password === correctPassword;
            });
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

            // When
            const result: SignInResponseDto = await authService.login(logInDTO);

            // Then
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(logInDTO.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(logInDTO.password, user.password);
            expect(jwtService.signAsync).toHaveBeenCalledWith({ email: user.email });
            expect(result).toEqual({ accessToken: 'accessToken' });
        });
    });
});
