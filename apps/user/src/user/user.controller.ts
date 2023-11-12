import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@sentry/node';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern({ cmd: 'findOneByEmail' })
    async findOneByEmail(email: string): Promise<{ id: string }> {
        const user = await this.userService.findOneByEmail(email);
        return { id: user?.id || null };
    }

    @MessagePattern({ cmd: 'create' })
    async create({ email, password }: { email: string; password: string }): Promise<{ id: string }> {
        const user = await this.userService.create(email, password);
        return { id: user.id };
    }

    @MessagePattern({ cmd: 'validate' })
    async validate({ email, password }: { email: string; password: string }): Promise<{ id: string }> {
        const { id } = await this.userService.validate(email, password);
        return { id };
    }

    @MessagePattern({ cmd: 'checkIsAdmin' })
    async checkIsAdmin({ id }): Promise<boolean> {
        const isAdmin = await this.userService.checkIsAdmin(id);
        return isAdmin;
    }

    @MessagePattern({ cmd: 'getAll' })
    async getAll(): Promise<User[]> {
        const users = await this.userService.getAll();
        return users;
    }
}
