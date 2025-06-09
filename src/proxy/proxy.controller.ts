import { Controller, All, Req, Res } from '@nestjs/common'
import { ProxyService } from './proxy.service'
import { Request, Response } from 'express'

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    @All('*')
    forward(@Req() req: Request, @Res() res: Response) {
        this.proxyService.handle(req, res)
    }
}
