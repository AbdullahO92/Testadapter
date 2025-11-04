import { Module } from '@nestjs/common'
import { NotificationQueueService } from './eventQueue.service'
import { EventMappingRepository } from 'src/eventmapping/eventmapping.service'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { EventSubscriptionRepository } from 'src/eventsubscription/eventsubscription.repository'
import { PrismaService } from 'src/prisma/prisma.service'
import { EventService } from './event.service'
import { TranslationModule } from 'src/translation/translation.module'

import { UserService } from 'src/user/user.service'

@Module({
    providers: [
        EventService,
        UserService,
        PrismaService,
        NotificationQueueService,
        EventMappingRepository,
        ExternalIdentityRepository,
        EventSubscriptionRepository,
    ],
    exports: [EventService],
    imports: [TranslationModule],
    controllers: [],
})
export class EventModule {}
