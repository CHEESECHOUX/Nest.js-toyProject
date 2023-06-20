import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestAppModule } from '@src/test-app.module';
import { User } from '@src/users/user.entity';
import { CreateUserDTO, LogInDTO, SignInResponseDto } from './dto/auth.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@src/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [TestAppModule],
            controllers: [AuthController],
            providers: [
                AuthService,
                UsersService,
                JwtService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('signup', () => {
        it('should call signup and return user', async () => {
            // Given
            const createUserDTO: CreateUserDTO = {
                name: 'jisoo',
                email: 'jisoo@test.com',
                password: 'password',
            };
            const createdUser: User = {
                id: 1,
                email: 'jisoo@test.com',
                password: 'hashedPassword',
                name: 'jisoo',
                isActive: true,
                isDeleted: false,
                createdAt: new Date('2023-06-20 17:01:12.027319'),
                updatedAt: new Date('2023-06-20 17:01:12.027319'),
            };

            // authService.signUp 모의 함수를 만들고 반환값을 설정
            authService.signUp = jest.fn().mockResolvedValue(createdUser);

            // When
            const result: User = await authController.signup(createUserDTO);

            // Then
            expect(authService.signUp).toHaveBeenCalledWith(createUserDTO);
            expect(result).toBe(createdUser);
        });
    });

    describe('login', () => {
        it('should call login and return SignInResponseDto', async () => {
            // Given
            const logInDTO: LogInDTO = {
                email: 'jisoo@test.com',
                password: 'hashedPassword',
            };
            const signInResponse: SignInResponseDto = {
                accessToken: 'accessToken',
            };

            authService.login = jest.fn().mockResolvedValue(signInResponse);

            // When
            const result: SignInResponseDto = await authController.login(logInDTO);

            // Then
            expect(authService.login).toHaveBeenCalledWith(logInDTO);
            expect(result).toBe(signInResponse);
        });
    });
});
