import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Public } from '../common/decorator/public.decorator';

@Controller('health')
export class HealthController {
    constructor(private helthService: HealthCheckService, private db: TypeOrmHealthIndicator) {}

    @Get()
    @HealthCheck()
    @Public()
    check() {
        return this.helthService.check([() => this.db.pingCheck('database')]);
    }
}
