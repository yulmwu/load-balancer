export interface BackendServer {
    url: string
    healthPath?: string
}

export interface LBConfig {
    backendServers: BackendServer[]
    healthCheckIntervalMs?: number
}

export const defaultConfig: LBConfig = {
    backendServers: [
        { url: 'http://localhost:3001', healthPath: '/' },
        { url: 'http://localhost:3002', healthPath: '/' },
        { url: 'http://localhost:3003', healthPath: '/' },
    ],
    healthCheckIntervalMs: 2000,
}

