import { Injectable, Logger } from '@nestjs/common'
import { EventMappingRepository } from 'src/eventmapping/eventmapping.service'
import { NotificationQueueService } from './eventQueue.service'
import { UserService } from 'src/user/user.service'
import { TranslationService } from 'src/translation/translation.service'

@Injectable()
export class EventService {
    constructor(
        private readonly queue: NotificationQueueService,
        private readonly userService: UserService,
        private readonly eventMappingRepository: EventMappingRepository,
        private readonly translationService: TranslationService
    ) {}

    public async sendNotification(
        externalIdentities: string[],
        eventMappingId: string,
        notification: any
    ): Promise<void> {
        const eventMapping = await this.eventMappingRepository.findById(
            eventMappingId,
            true
        )
        if (!eventMapping) {
            console.error(`Event mapping not found for ID: ${eventMappingId}`)
            return
        }

        const users =
            await this.userService.findManyByExternalIdentityId(
                externalIdentities
            )
        if (!users) {
            Logger.error(
                `No users found for external identities: ${externalIdentities}`
            )
            return
        }

        for (const user of users) {
            if (!user.isActive) continue
            const translated = this.translationService.translateBodyToCard(
                eventMapping.response,
                user,
                notification
            )
            if (!translated) {
                Logger.warn(
                    `Skipped sending notification because no translator was available for response ${eventMapping.response.internalName}`
                )
                continue
            }

            this.queue.sendMessageToQueue(translated)
        }
    }
}
