import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

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

        const refreshToken = await this.generateRefreshToken(user.id);
        await this.createRefreshTokenUsingUser(user.id, refreshToken);

        return {
            accessToken: this.jwtService.sign({ sub: user.id }),
            refreshToken,
        };
    }

    private generateRefreshToken(userId: string) {
        const payload = { sub: userId, tokenType: 'refresh' };
        return this.jwtService.sign(payload, { expiresIn: '1d' });
    }

    private async createRefreshTokenUsingUser(userId: string, refreshToken: string) {
        let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({ user: { id: userId } });

        if (refreshTokenEntity) {
            refreshTokenEntity.token = refreshToken;
        } else {
            refreshTokenEntity = this.refreshTokenRepository.create({ user: { id: userId }, token: refreshToken });
        }

        await this.refreshTokenRepository.save(refreshTokenEntity);
    }
}
