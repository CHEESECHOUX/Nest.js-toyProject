import { IsString } from 'class-validator';

export class AuthDTO {
    @IsString()
    email: string;
    name: string;
    password: string;
}
export class SignInResponseDto {
    accessToken: string;
}

export interface UserInfo {
    id: string;
    name: string;
    password: string;
}
