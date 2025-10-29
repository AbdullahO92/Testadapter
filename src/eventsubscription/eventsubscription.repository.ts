import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EventSubscription, ExternalIdentity } from '@prisma/client'
import { NotificationStateDto } from './notificationstate.dto'
import { EventSubscriptionDto } from './eventsubscription.dto'

@Injectable()
export class EventSubscriptionRepository {
    constructor(private prisma: PrismaService) {}

    async create(
        eventMappingId: string,
        externalIdentityId: string
    ): Promise<EventSubscriptionDto | null> {
        try {
            const result = await this.prisma.eventSubscription.create({
                data: {
                    eventMappingId: eventMappingId,
                    externalIdentityId: externalIdentityId,
                },
            })
            if (!result) return null

            return new EventSubscriptionDto(result)
        } catch (e) {
            Logger.error(
                `Error creating subscription for event mapping ${eventMappingId} and external identity ${externalIdentityId}: ${e.message}`
            )
        }
        return null
    }

    async find(
        eventMappingId: string,
        externalIdentityId: string
    ): Promise<EventSubscriptionDto | null> {
        try {
            const result = await this.prisma.eventSubscription.findFirst({
                where: {
                    eventMappingId: eventMappingId,
                    externalIdentityId: externalIdentityId,
                },
            })
            if (!result) return null
        } catch (e) {
            Logger.error(
                `Error finding subscription for event mapping ${eventMappingId} and external identity ${externalIdentityId}: ${e.message}`
            )
        }
        return null
    }

    async findAll(
        eventMappingId: string,
        externalIdentities: ExternalIdentity[]
    ): Promise<EventSubscription[]> {
        const subscriptions: EventSubscription[] = []
        try {
            externalIdentities.forEach(async (externalIdentity) => {
                const subscription =
                    await this.prisma.eventSubscription.findFirst({
                        where: {
                            eventMappingId: eventMappingId,
                            externalIdentityId: externalIdentity.id,
                        },
                    })
                if (subscription != null) {
                    subscription[externalIdentity.externalId] = subscription
                }
            })
        } catch (e) {
            Logger.error(
                `Error finding subscriptions for event mapping ${eventMappingId}: ${e.message}`
            )
        }
        return subscriptions
    }

    async addState(
        externalIdentityId: string,
        eventMappingId: string,
        notificationHash: string
    ): Promise<EventSubscriptionDto | null> {
        try {
            await this.prisma.eventSubscription.create({
                data: {
                    externalIdentityId: externalIdentityId,
                    eventMappingId: eventMappingId,
                    notificationHash: notificationHash,
                    lastUpdated: new Date(),
                    enabled: true,
                },
            })
        } catch (e) {
            Logger.error(
                `Error adding state for external identity ${externalIdentityId} and event mapping ${eventMappingId}: ${e.message}`
            )
        }
        return null
    }

    async updateState(
        externalIdentityId: string,
        eventMappingId: string,
        notificationHash: string
    ): Promise<NotificationStateDto | null> {
        try {
            let existingState = await this.find(
                eventMappingId,
                externalIdentityId
            )
            if (!existingState) {
                existingState = await this.addState(
                    externalIdentityId,
                    eventMappingId,
                    notificationHash
                )
                return new NotificationStateDto(
                    externalIdentityId,
                    eventMappingId,
                    existingState.notificationHash
                )
            }

            const result = await this.prisma.eventSubscription.update({
                where: {
                    id: existingState.id,
                },
                data: {
                    notificationHash: notificationHash,
                    lastUpdated: new Date(),
                },
            })
            if (result != null)
                return new NotificationStateDto(
                    result.externalIdentityId,
                    result.eventMappingId,
                    result.notificationHash
                )
        } catch (e) {
            Logger.error(
                `Error updating state for external identity ${externalIdentityId} and event mapping ${eventMappingId}: ${e.message}`
            )
        }
        return null
    }
}
