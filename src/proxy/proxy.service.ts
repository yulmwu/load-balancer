import { Injectable } from '@nestjs/common'
import * as httpProxy from 'http-proxy'
import { Request, Response } from 'express'
import { HealthCheckService } from './health-check.service'
import { defaultConfig } from './config'

@Injectable()
export class ProxyService {
    private proxy = httpProxy.createProxyServer()
    private rrCurrentIndex = 0

    constructor(private healthCheck: HealthCheckService) {}

    handle(req: Request, res: Response) {
        const healthyServers = this.healthCheck.getHealthyServers()
        if (healthyServers.length === 0) {
            return res.status(503).send('No healthy backend servers')
        }

        let target: string
        if (defaultConfig.strategy === 'random') {
            const randIndex = Math.floor(Math.random() * healthyServers.length)
            target = healthyServers[randIndex]
        } else {
            target = healthyServers[this.rrCurrentIndex % healthyServers.length]
            this.rrCurrentIndex++
        }

        this.proxy.web(req, res, { target }, (err) => {
            res.status(502).send(`Bad Gateway: ${err.message}`)
        })
    }

    getHealthStatus() {
        return this.healthCheck.getAllStatus()
    }
}
