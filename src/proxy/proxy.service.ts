import { Injectable } from '@nestjs/common'
import * as httpProxy from 'http-proxy'
import { Request, Response } from 'express'
import { HealthCheckService } from './health-check.service'

@Injectable()
export class ProxyService {
    private proxy = httpProxy.createProxyServer()
    private index = 0

    constructor(private healthCheck: HealthCheckService) {}

    handle(req: Request, res: Response) {
        const healthyServers = this.healthCheck.getHealthyServers()
        if (healthyServers.length === 0) {
            return res.status(503).send('No healthy backend servers')
        }

        const target = healthyServers[this.index % healthyServers.length]
        this.index++

        this.proxy.web(req, res, { target }, (err) => {
            console.error('[Proxy Error]', err.message)
            res.status(502).send('Bad Gateway')
        })
    }
}
