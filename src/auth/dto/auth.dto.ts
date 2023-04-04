export class AuthDTO {
    id: number;
    email: string;
    name: string;
    password: string;
}
export class SignInResponseDto {
    accessToken: string;
}
