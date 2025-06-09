import { Injectable, OnModuleInit } from '@nestjs/common'
import axios from 'axios'
import { defaultConfig } from './config'

export interface ServerStatus {
    url: string
    healthy: boolean
}

@Injectable()
export class HealthCheckService implements OnModuleInit {
    private intervalMs = defaultConfig.healthCheckIntervalMs ?? 5000
    private status: ServerStatus[] = []

    async onModuleInit() {
        this.status = defaultConfig.backendServers.map((s) => ({ url: s.url, healthy: true }))
        this.checkHealthLoop()
    }

    getHealthyServers(): string[] {
        return this.status.filter((s) => s.healthy).map((s) => s.url)
    }

    getAllStatus(): ServerStatus[] {
        return this.status
    }

    private async checkHealthLoop() {
        while (true) {
            for (let i = 0; i < defaultConfig.backendServers.length; i++) {
                const server = defaultConfig.backendServers[i]
                const healthPath = server.healthPath ?? '/'
                const url = `${server.url}${healthPath}`

                try {
                    const res = await axios.get(url, { timeout: 1000 })
                    this.status[i].healthy = res.status >= 200 && res.status < 400
                } catch {
                    this.status[i].healthy = false
                }
            }

            console.log(`[${new Date().toISOString()}]`, this.status)
            await new Promise((res) => setTimeout(res, this.intervalMs))
        }
    }
}
