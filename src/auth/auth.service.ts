import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        return null;
    }

    async signup(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        if (user) throw new BadRequestException();
        const newUser = await this.userService.create(email, password);
        return newUser;
    }

    async signin(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException();

        const isMatch = password == user.password;
        if (!isMatch) throw new UnauthorizedException();

        return {
            acccessToken: this.jwtService.sign({ sub: user.id }),
        };
    }
}
