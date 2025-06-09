export interface BackendServer {
    url: string
    healthPath?: string
}

export interface LBConfig {
    strategy: 'round-robin' | 'random'
    backendServers: BackendServer[]
    healthCheckIntervalMs?: number
    healthCheckFailureThreshold?: number,
}

export const defaultConfig: LBConfig = {
    strategy: 'round-robin',
    backendServers: [
        { url: 'http://localhost:3001', healthPath: '/' },
        { url: 'http://localhost:3002', healthPath: '/' },
        { url: 'http://localhost:3003', healthPath: '/' },
    ],
    healthCheckIntervalMs: 2000
}

