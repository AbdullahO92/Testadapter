import { Module } from '@nestjs/common'
import { EventSubscriptionRepository } from './eventsubscription.repository'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [EventSubscriptionRepository],
    providers: [EventSubscriptionRepository, PrismaService],
    controllers: [],
})
export class EventSubscriptionModule {}
