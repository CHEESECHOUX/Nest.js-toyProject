import { Test } from '@nestjs/testing';
import { AuthService } from '@src/auth/auth.service';
import { User } from '@src/users/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from '@src/users/users.repository';
import { CreateUserDTO } from '@src/auth/dto/auth.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthService, UsersRepository],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersRepository = module.get<Repository<User>>(Repository);
    });

    describe('signUp', () => {
        it('should create user', async () => {
            const createUserDTO = new CreateUserDTO();
            createUserDTO.name = 'jisoo';
            createUserDTO.email = 'jisoo@test.com';
            createUserDTO.password = '1234';

            const user = new User();
            user.name = createUserDTO.name;
            user.email = createUserDTO.email;
            user.password = createUserDTO.password;

            const userRepositorySaveSpy = jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

            const result = await authService.signUp(createUserDTO);

            expect(userRepositorySaveSpy).toBeCalledWith(createUserDTO);
            expect(result).toBe(user);
        });
    });
});
