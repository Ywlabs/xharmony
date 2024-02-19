/**
 * *헬스체크용 컨트롤러 
 * TODO : Terminus 라이브러리 적용 (완료)
 * TODO : 다양한 방법으로 적용해보기 
 *  HttpHealthIndicator
    TypeOrmHealthIndicator
    MongooseHealthIndicator
    SequelizeHealthIndicator
    MikroOrmHealthIndicator
    PrismaHealthIndicator
    MicroserviceHealthIndicator
    GRPCHealthIndicator
    MemoryHealthIndicator
    DiskHealthIndicator
 * 
 */

import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller({ path: "health", version: "1" })
export class HealthController { 
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,        
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('health-check', 'https://docs.nestjs.com'),
            () => this.disk.checkStorage('storage', { path: 'C:/', thresholdPercent: 0.5 }),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ]);
    }   
}
