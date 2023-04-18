import { Test } from '@nestjs/testing';
import { AuthService } from '@src/auth/auth.service';
import { User } from '@src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '@src/auth/dto/auth.dto';
import { AuthModule } from '@src/auth/auth.module';
import { JwtStrategy } from '@src/auth/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeOrm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UsersModule } from '@src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
                TypeOrmModule.forRootAsync({
                    imports: [
                        ConfigModule,
                        PassportModule,
                        JwtModule.registerAsync({
                            imports: [ConfigModule],
                            inject: [ConfigService],
                            useFactory: async (config: ConfigService) => ({
                                secret: config.get('JWT_SECRET'),
                                signOptions: {
                                    expiresIn: config.get('JWT_EXP'),
                                },
                            }),
                        }),
                    ],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        type: 'mysql',
                        host: configService.get('DB_HOST'),
                        port: 3306,
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_NAME'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: false,
                        autoLoadEntities: true,
                        logging: false,
                        socketPath: '/tmp/mysql.sock',
                        namingStrategy: new SnakeNamingStrategy(),
                    }),
                }),
                TypeOrmModule.forFeature([User]),
                AuthModule,
                UsersModule,
            ],
            providers: [AuthService, JwtStrategy, JwtService],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('signUp', () => {
        it('should create user', async () => {
            const createUserDTO = new CreateUserDTO();
            createUserDTO.name = 'jisoo';
            createUserDTO.email = 'jisoo@test.com';
            createUserDTO.password = '1234';

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

            const expectedUser = new User();
            expectedUser.name = createUserDTO.name;
            expectedUser.email = createUserDTO.email;
            expectedUser.password = hashedPassword;

            const userRepositorySaveSpy = jest.spyOn(usersRepository, 'save').mockResolvedValue(expectedUser);

            const result = await authService.signUp(createUserDTO);

            expect(userRepositorySaveSpy).toBeCalledWith(expectedUser);
            expect(result).toBe(expectedUser);
        });
    });
});
