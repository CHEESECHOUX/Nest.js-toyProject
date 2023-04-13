import { IsEmail, IsString } from 'class-validator';
export class LogInDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class CreateUserDTO extends LogInDTO {
    @IsString()
    name: string;
}

export class SignInResponseDto {
    @IsString()
    accessToken: string;
}

export interface UserInfo {
    id: string;
    name: string;
    password: string;
}
