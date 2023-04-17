import { User } from '../user.entity';

export class UsersInfoDTO {
    email: string;
    name: string;

    constructor(user: User) {
        this.email = user.email;
        this.name = user.name;
    }
}
