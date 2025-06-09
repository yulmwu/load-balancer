import { Module } from '@nestjs/common'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'
import { HealthCheckService } from './health_check.service'

@Module({
    controllers: [ProxyController],
    providers: [ProxyService, HealthCheckService],
})
export class ProxyModule {}
