import { Controller, All, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { LoadBalancerService } from './app.service'

@Controller()
export class LoadBalancerController {
    constructor(private readonly lbService: LoadBalancerService) {}

    @All('*')
    handleAll(@Req() req: Request, @Res() res: Response): void {
        this.lbService.proxyRequest(req, res)
    }
}
