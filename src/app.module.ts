import { Module } from '@nestjs/common'
import { LoadBalancerController } from './app.controller'
import { LoadBalancerService } from './app.service'

@Module({
    controllers: [LoadBalancerController],
    providers: [LoadBalancerService],
})
export class AppModule {}
