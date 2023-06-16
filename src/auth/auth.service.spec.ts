import { Test } from '@nestjs/testing';
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
    let authService: AuthService;
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [TestAppModule],
            providers: [
                {
                    provide: 'bcrypt',
                    useValue: {
                        genSalt: jest.fn(() => Promise.resolve('salt')),
                        hashSync: jest.fn((password, salt) => bcrypt.hashSync(password, salt)),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('signUp', () => {
        let createUserDTO;
        let findOneSpy;
        let saveSpy;
        let hashSpy;
        let savedUser;

        beforeEach(() => {
            // Given
            createUserDTO = new CreateUserDTO();
            createUserDTO.name = 'jisoo';
            createUserDTO.email = 'jisoo@test.com';
            createUserDTO.password = 'hashedPassword';

            findOneSpy = jest.spyOn(usersRepository, 'findOne');
            findOneSpy.mockResolvedValue(null);

            saveSpy = jest.spyOn(usersRepository, 'save');
            savedUser = new User();
            Object.assign(savedUser, createUserDTO);
            saveSpy.mockResolvedValue(savedUser);

            hashSpy = jest.spyOn(bcrypt, 'hash');
            hashSpy.mockImplementation(async () => 'hashedPassword');
        });

        it('should create a new user', async () => {
            // When
            const result = await authService.signUp(createUserDTO);

            // Then
            expect(findOneSpy).toHaveBeenCalledWith({ where: { email: createUserDTO.email } });
            expect(hashSpy).toHaveBeenCalledWith(createUserDTO.password, expect.any(String));
            expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining(createUserDTO));
            expect(result).toEqual(createUserDTO);
        });
    });

    describe('login', () => {
        const logInDTO: LogInDTO = {
            email: 'jisoo@test.com',
            password: 'hashedPassword',
        };
        const user: User = {
            id: 1,
            name: 'Jisoo',
            email: logInDTO.email,
            password: 'hashedPassword',
            isActive: true,
            isDeleted: false,
            createdAt: new Date('2023-06-15 00:27:57.070889'),
            updatedAt: new Date('2023-06-15 00:27:57.070889'),
        };

        it('should throw UnauthorizedException if email is not found', async () => {
            // Given
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

            // When/Then
            await expect(authService.login(logInDTO)).rejects.toThrow(UnauthorizedException);
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(logInDTO.email);
        });

        it('should throw UnauthorizedException if password is not correct', async () => {
            // Given
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user); // 해당하는 유저를 찾았다고 가정
            jest.spyOn(bcrypt, 'compare').mockImplementation((password: string, InvalidPassword: string) => {
                return password !== InvalidPassword;
            });

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
