import { Injectable, OnModuleInit } from '@nestjs/common'
import axios from 'axios'
import { defaultConfig } from './config'

export interface ServerStatus {
    url: string
    healthy: boolean
    failureCount: number
}

@Injectable()
export class HealthCheckService implements OnModuleInit {
    private intervalMs = defaultConfig.healthCheckIntervalMs ?? 5000
    private healthCheckFailureThreshold = defaultConfig.healthCheckFailureThreshold ?? 3

    private status: ServerStatus[] = []

    async onModuleInit() {
        this.status = defaultConfig.backendServers.map((s) => ({ url: s.url, healthy: false, failureCount: 0 }))
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

                const currentStatus = this.status[i]

                try {
                    const res = await axios.get(url, { timeout: 1000 })
                    if (res.status >= 200 && res.status < 400) {
                        currentStatus.failureCount = 0
                        currentStatus.healthy = true
                    } else {
                        if (currentStatus.healthy) currentStatus.failureCount++
                    }
                } catch(e) {
                    console.error(`Health check failed for ${url}:`, e)
                    if (currentStatus.healthy) currentStatus.failureCount++
                }

                if (currentStatus.failureCount >= this.healthCheckFailureThreshold) currentStatus.healthy = false
            }

            if (defaultConfig.logging) {
                const date = new Date().toISOString().replace('T', ' ').split('.')[0]
                console.log(`\n[${date}] Health check status:`)
                this.status.forEach((s) => {
                    console.log(`     => url: '${s.url}' healthy: ${s.healthy}, failureCount: ${s.failureCount}`)
                })
            }

            await new Promise((res) => setTimeout(res, this.intervalMs))
        }
    }
}
