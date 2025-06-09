import { Injectable } from '@nestjs/common'
import * as httpProxy from 'http-proxy'
import { Request, Response } from 'express'
import { HealthCheckService } from './health_check.service'
import { defaultConfig } from './config'

@Injectable()
export class ProxyService {
    private proxy = httpProxy.createProxyServer()

    private rrCurrentIndex = 0

    constructor(private healthCheck: HealthCheckService) {}

    private getNextTarget(): string | null {
        const healthyServers = this.healthCheck.getHealthyServers()
        if (healthyServers.length === 0) return null

        switch (defaultConfig.strategy) {
            case 'random': {
                const r = Math.floor(Math.random() * healthyServers.length)
                return healthyServers[r]
            }

            case 'round-robin': {
                const target = healthyServers[this.rrCurrentIndex % healthyServers.length]
                this.rrCurrentIndex++
                return target
            }

            default:
                throw new Error(`Unknown load balancing strategy: ${defaultConfig.strategy}`)
        }
    }

    handle(req: Request, res: Response) {
        const target = this.getNextTarget()
        if (!target) return res.status(503).send('No healthy backend servers available')

        this.proxy.web(req, res, { target }, (err) => {
            res.status(502).send(`Bad Gateway: ${err.message}`)
        })
    }

    getHealthStatus() {
        return this.healthCheck.getAllStatus()
    }
}
