import { IsString } from 'class-validator';

export class AuthDTO {
    @IsString()
    email: string;
    password: string;
    name: string;
}
export class SignInResponseDto {
    accessToken: string;
}
