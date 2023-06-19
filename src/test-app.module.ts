import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@src/auth/auth.service';
import { JwtStrategy } from '@src/auth/jwt/jwt.strategy';
import { AuthModule } from '@src/auth/auth.module';
import { User } from '@src/users/user.entity';
import { UsersModule } from '@src/users/users.module';
import { UsersService } from '@src/users/users.service';
import * as Joi from 'joi';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${__dirname}/config/.${process.env.NODE_ENV}.env`,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
                PORT: Joi.number().default(3000),
                JWT_SECRET: Joi.string().required(),
                JWT_EXP: Joi.number().required(),
                DB_HOST: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
            }).options({ stripUnknown: true }),
            validationOptions: {
                allowUnknown: false,
                abortEarly: true,
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: 3306,
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
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
    providers: [
        AppService,
        AuthService,
        UsersService,
        JwtStrategy,
        JwtService,
        {
            provide: getRepositoryToken(User),
            useClass: Repository,
        },
        {
            provide: 'bcrypt',
            useValue: {
                genSalt: jest.fn(() => Promise.resolve('salt')),
                hashSync: jest.fn((password, salt) => bcrypt.hashSync(password, salt)),
            },
        },
    ],
})
export class TestAppModule {}
