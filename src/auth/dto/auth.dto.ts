import { IsString } from 'class-validator';
export class AuthDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;

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
