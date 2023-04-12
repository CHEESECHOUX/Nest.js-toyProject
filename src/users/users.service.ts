import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeOrm';
import { User } from './user.entity';
import { Repository } from 'typeOrm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async getUserByEmail(email: string): Promise<User | null> {
        const userEmail = await this.usersRepository.findOneBy({ email });
        return userEmail;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.update(id, { isDeleted: true });
    }
}
