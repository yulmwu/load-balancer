export interface BackendServer {
    url: string
    healthPath?: string
}

export interface LBConfig {
    strategy: 'round-robin' | 'random'
    backendServers: BackendServer[]
    healthCheckIntervalMs?: number
    healthCheckFailureThreshold?: number,
    logging?: boolean
}

export const defaultConfig: LBConfig = {
    strategy: 'round-robin',
    backendServers: [
        { url: 'http://host.docker.internal:3001', healthPath: '/' },
        { url: 'http://host.docker.internal:3002', healthPath: '/' },
        { url: 'http://host.docker.internal:3003', healthPath: '/' },
    ],
    healthCheckIntervalMs: 2000,
    logging: true,
}
