import { IsString } from 'class-validator';

export class AuthDTO {
    @IsString()
    email: string;
    password: string;
    name: string;
}
