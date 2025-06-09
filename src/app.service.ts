import { Injectable } from '@nestjs/common'
import * as httpProxy from 'http-proxy'

@Injectable()
export class LoadBalancerService {
    private proxy = httpProxy.createProxyServer({})
    private targets = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003']
    private currentIndex = 0

    getNextTarget(): string {
        const target = this.targets[this.currentIndex]
        this.currentIndex = (this.currentIndex + 1) % this.targets.length
        return target
    }

    proxyRequest(req: any, res: any): void {
        const target = this.getNextTarget()
        console.log(`Forwarding to: ${target}`)
        this.proxy.web(req, res, { target }, (err) => {
            console.error('Proxy error:', err)
            res.writeHead(502)
            res.end('Bad Gateway')
        })
    }
}
