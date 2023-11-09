import { UnauthorizedException } from '@nestjs/common';

export class HeaderUtil {
    static getToken(authorization: string) {
        const bearerTokenArray = /Bearer\s(.+)/.exec(authorization);
        if (!bearerTokenArray) throw new UnauthorizedException();
        return bearerTokenArray[1];
    }
}
