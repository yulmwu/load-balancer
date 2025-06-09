import { Module } from '@nestjs/common'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'
import { HealthCheckService } from './health_check.service'
import { HealthController } from './health.controller'

@Module({
    controllers: [HealthController, ProxyController],
    providers: [ProxyService, HealthCheckService],
})
export class ProxyModule {}
