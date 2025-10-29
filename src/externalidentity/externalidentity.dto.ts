import {
    EventSubscription,
    ExternalIdentity,
    ExternalIdentityToken,
} from '@prisma/client'
import { EventSubscriptionDto } from 'src/eventsubscription/eventsubscription.dto'
import { ExternalIdentityTokenDto } from 'src/externalidentitytoken/externalidentitytoken.dto'

export class ExternalIdentityDto {
    public readonly id: string
    public readonly externalId: string
    public readonly enabled: boolean
    public readonly lastUpdated: Date
    public readonly configurationId: string

    public token: ExternalIdentityTokenDto | null = null
    public subscriptions: EventSubscriptionDto[] = []

    constructor(
        externalIdentity: ExternalIdentity,
        subscriptions: EventSubscription[] = [],
        token: ExternalIdentityToken | null = null
    ) {
        this.id = externalIdentity.id
        this.externalId = externalIdentity.externalId
        this.enabled = externalIdentity.enabled
        this.lastUpdated = externalIdentity.lastUpdated
        this.configurationId = externalIdentity.externalSystemConfigurationId

        if (token != null) {
            this.token = new ExternalIdentityTokenDto(token)
        }

        this.subscriptions = []
        subscriptions.forEach((subscription) => {
            this.subscriptions.push(new EventSubscriptionDto(subscription))
        })
    }
}
