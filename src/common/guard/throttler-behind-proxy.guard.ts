import { Injectable, LoggerService } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): Promise<string> {
        console.log('===', req.ips.length ? req.ips[0] : req.ip);
        return req.ips.length ? req.ips[0] : req.ip;
    }
}
