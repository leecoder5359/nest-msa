import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from '@sentry/node';
import { MessagePattern } from '../common/libs/message-pattern';

@Injectable()
export class UserService {
    constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

    async findOneByEmail(email: string) {
        const pattern = MessagePattern.from('findOneByEmail');
        const payload = email;
        const { id: userId } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));
        return userId;
    }

    async create(email: string, password: string) {
        const pattern = MessagePattern.from('create');
        const payload = { email, password };
        const { id: userId } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));
        return userId;
    }

    async validateUser(email: string, password: string) {
        const pattern = MessagePattern.from('validate');
        const payload = { email, password };
        const { id } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));
        return id;
    }

    async checkUserIsAdmin(id: string) {
        const pattern = MessagePattern.from('checkIsAdmin');
        const payload = { id };
        const isAdmin = await firstValueFrom<boolean>(this.client.send<boolean>(pattern, payload));
        return isAdmin;
    }

    async getAllUsers() {
        const pattern = MessagePattern.from('getAll');
        const payload = {};
        const users = await firstValueFrom<User[]>(this.client.send<User[]>(pattern, payload));
        return users;
    }
}
