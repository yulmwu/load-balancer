import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { ProxyService } from './proxy.service'
import { defaultConfig } from './config'

@Controller()
export class HealthController {
    constructor(private readonly proxyService: ProxyService) {}

    @Get('/__health')
    healthCheck(@Res() res: Response) {
        res.json({
            servers: this.proxyService.getHealthStatus(),
            config: { ...defaultConfig },
        })
    }
}
