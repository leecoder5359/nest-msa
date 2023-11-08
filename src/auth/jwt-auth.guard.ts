import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorator/public.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { HeaderUtil } from '../common/util/header.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const http = context.switchToHttp();
        const { url, headers } = http.getRequest<Request>();
        const token = HeaderUtil.getToken(headers['authorization']);
        const decoded = this.jwtService.decode(token);

        if (url !== '/api/auth/refresh' && decoded['tokenType'] === 'refresh') {
            console.error('accessToken is required');
            throw new UnauthorizedException();
        }

        return super.canActivate(context);
    }
}
