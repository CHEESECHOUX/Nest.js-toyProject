import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@src/auth/auth.service';
import { JwtStrategy } from '@src/auth/jwt/jwt.strategy';
import { User } from '@src/users/user.entity';
import { AuthModule } from '@src/auth/auth.module';
import { UsersModule } from '@src/users/users.module';

@Module({
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
    providers: [
        AuthService,
        JwtStrategy,
        JwtService,
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
