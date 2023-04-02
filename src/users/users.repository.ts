import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findByEmail(email: string): Promise<User | undefined> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.createQueryBuilder(User, 'user').where('user.email = :email', { email }).getOne();

            await queryRunner.commitTransaction();
            return user;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
