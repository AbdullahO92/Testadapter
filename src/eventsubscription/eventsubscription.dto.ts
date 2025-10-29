import { EventSubscription } from '@prisma/client'

export class EventSubscriptionDto {
    public readonly id: string
    public readonly externalIdentityId: string
    public readonly eventMappingId: string
    public readonly enabled: boolean
    public readonly notificationHash: string | null
    public readonly lastUpdated: Date | null

    constructor(subscription: EventSubscription) {
        this.id = subscription.id
        this.externalIdentityId = subscription.externalIdentityId
        this.eventMappingId = subscription.eventMappingId
        this.enabled = subscription.enabled
        this.notificationHash = subscription.notificationHash
        this.lastUpdated = subscription.lastUpdated
    }
}
