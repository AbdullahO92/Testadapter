import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EventSubscriptionHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async addSubscription(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        eventMappingId: string
    ): Promise<boolean> {
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            eventMappingId
        )
    }

    public async addSubscriptions(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        eventMappingIds: string[]
    ): Promise<boolean> {
        return await this.addEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            eventMappingIds
        )
    }

    public async removeSubscription(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        eventMappingId: string
    ): Promise<boolean> {
        return await this.removeEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            eventMappingId
        )
    }

    public async removeSubscriptions(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        eventMappingIds: string[]
    ): Promise<boolean> {
        return await this.removeEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            eventMappingIds
        )
    }

    public async isSubscribed(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        eventMappingId: string
    ): Promise<Boolean> {
        const subscriptions = await this.getEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
        if (!subscriptions) return false

        return subscriptions.includes(eventMappingId)
    }

    protected getEntryName(key: string): string {
        return `${key}:eventSubscriptions`
    }
}
