import { Module } from '@nestjs/common';
import { AuthController } from '@src/auth/auth.controller';
import { AuthService } from '@src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/auth/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeOrm';
import { User } from '@src/users/user.entity';
@Module({
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
        TypeOrmModule.forFeature([User]),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
