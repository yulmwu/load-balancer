import { Controller, All, Req, Res, Get } from '@nestjs/common'
import { ProxyService } from './proxy.service'
import { Request, Response } from 'express'
import { defaultConfig } from './config'

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    @Get('/__health')
    healthCheck(@Res() res: Response) {
        res.json({
            servers: this.proxyService.getHealthStatus(),
            config: { ...defaultConfig },
        })
    }

    @All('*')
    forward(@Req() req: Request, @Res() res: Response) {
        this.proxyService.handle(req, res)
    }
}
