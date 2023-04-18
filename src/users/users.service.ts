import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeOrm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UsersInfoDTO } from './dto/users.dto';
import { AuthUserType } from '@src/common/decorators/users.decorator';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async getUserByEmail(email: string): Promise<User | null> {
        const userEmail = await this.usersRepository.findOneBy({ email });
        return userEmail;
    }

    async getUserInfo({ id }: AuthUserType): Promise<UsersInfoDTO | null> {
        const userInfo = await this.usersRepository.findOne({ where: { id } });
        if (!userInfo) {
            throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다');
        }
        return userInfo;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.update(id, { isDeleted: true });
    }
}
