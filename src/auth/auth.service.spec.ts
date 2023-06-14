import { Test } from '@nestjs/testing';
import { AuthService } from '@src/auth/auth.service';
import { User } from '@src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '@src/auth/dto/auth.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TestAppModule } from '@src/test-app.module';

describe('AuthService', () => {
    let authService: AuthService;
    let usersRepository: Repository<User>;

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
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('signUp', () => {
        it('should create a new user', async () => {
            // Given
            const createUserDTO = new CreateUserDTO();
            createUserDTO.name = 'jisoo';
            createUserDTO.email = 'jisoo@test.com';
            createUserDTO.password = 'hashedPassword';

            const findOneSpy = jest.spyOn(usersRepository, 'findOne');
            findOneSpy.mockResolvedValue(null);

            const saveSpy = jest.spyOn(usersRepository, 'save');
            const savedUser = new User();
            Object.assign(savedUser, createUserDTO);
            saveSpy.mockResolvedValue(savedUser);

            const hashSpy = jest.spyOn(bcrypt, 'hash');
            hashSpy.mockImplementation(async () => 'hashedPassword');

            // When
            const result = await authService.signUp(createUserDTO);

            // Then
            expect(findOneSpy).toHaveBeenCalledWith({ where: { email: createUserDTO.email } });
            expect(hashSpy).toHaveBeenCalledWith(createUserDTO.password, expect.any(String));
            expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining(createUserDTO));
            expect(result).toEqual(createUserDTO);
        });
    });
});
