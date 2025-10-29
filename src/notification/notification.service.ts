import { ExternalSystemDto } from 'src/externalsystem/externalsystem.dto'
import { EventMappingHandler } from '../entityhandler/eventmapping/eventmappinghandler'
import { EventSubscriptionHandler } from '../entityhandler/eventsubscription/eventsubscriptionhandler'
import { ExternalIdentityHandler } from '../entityhandler/externalidentity/externalidentityhandler'
import { ExternalSystemHandler } from '../entityhandler/externalsystem/externalsystemhandler'
import { ExternalSystemResponseHandler } from '../entityhandler/externalsystemresponse/externalsystemresponsehandler'
import { StateHandler } from '../statehandler/statehandler'
import { ExternalSystemConfigurationHandler } from '../entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { Logger } from '@nestjs/common'

export abstract class NotificationService {
    constructor(
        private readonly identityHandler: ExternalIdentityHandler,
        private readonly subscriptionHandler: EventSubscriptionHandler,
        private readonly responseHandler: ExternalSystemResponseHandler,
        private readonly mappingHandler: EventMappingHandler,
        private readonly systemHandler: ExternalSystemHandler,
        private readonly configurationHandler: ExternalSystemConfigurationHandler,
        private readonly configurationHostHandler: ExternalSystemConfigurationHostHandler,
        private readonly stateHandler: StateHandler,
        protected readonly externalSystemName: string
    ) {}

    protected async init(externalSystem: ExternalSystemDto): Promise<boolean> {
        let inserted = await this.systemHandler.addExternalSystem(
            externalSystem.name,
            externalSystem.id
        )
        if (!inserted) return false

        for (const response of externalSystem.responses) {
            await this.responseHandler.addResponse(
                this.externalSystemName,
                response.internalName,
                response.id
            )
        }

        for (const configuration of externalSystem.externalSystemConfigurations) {
            inserted = await this.configurationHandler.addConfiguration(
                this.externalSystemName,
                configuration.id
            )
            if (!inserted) continue

            inserted = await this.configurationHostHandler.addConfigurationHost(
                this.externalSystemName,
                configuration.id,
                configuration.domain
            )
            if (!inserted) continue

            for (const mapping of configuration.eventMappings) {
                await this.mappingHandler.addMapping(
                    this.externalSystemName,
                    configuration.id,
                    mapping.externalSystemResponseId,
                    mapping.id
                )
            }

            for (const identity of configuration.externalIdentities) {
                inserted = await this.identityHandler.addIdentity(
                    this.externalSystemName,
                    configuration.id,
                    identity.id
                )
                if (!inserted) continue

                await this.subscriptionHandler.addSubscriptions(
                    this.externalSystemName,
                    configuration.id,
                    identity.id,
                    identity.subscriptions.map(
                        (subscription) => subscription.eventMappingId
                    )
                )

                for (const subscription of identity.subscriptions) {
                    await this.stateHandler.addState(
                        subscription.externalIdentityId,
                        subscription.eventMappingId,
                        subscription.notificationHash
                    )
                }
            }
        }
        return true
    }

    protected async insertExternalIdentity(
        externalIdentityId: string,
        configurationId: string,
        subscriptions: string[]
    ): Promise<boolean> {
        const result = await this.identityHandler.addIdentity(
            this.externalSystemName,
            configurationId,
            externalIdentityId
        )
        if (!result) return false

        return await this.subscriptionHandler.addSubscriptions(
            this.externalSystemName,
            configurationId,
            externalIdentityId,
            subscriptions
        )
    }

    protected async getConfigurations(): Promise<string[] | null> {
        return await this.configurationHandler.getConfigurations(
            this.externalSystemName
        )
    }

    protected async getConfigurationHost(
        externalSystemConfigurationId: string
    ): Promise<string | null> {
        return await this.configurationHostHandler.getConfigurationHost(
            this.externalSystemName,
            externalSystemConfigurationId
        )
    }

    protected async getSubscribers(
        externalSystemConfigurationId: string,
        eventMappingId: string
    ): Promise<string[] | null> {
        const subscribers: string[] = []

        const identities = await this.identityHandler.getIdentities(
            this.externalSystemName,
            externalSystemConfigurationId
        )
        if (!identities) {
            Logger.warn(
                `No identities found for external system configuration ${externalSystemConfigurationId}`
            )
            return null
        }

        for (const identity of identities) {
            if (
                this.subscriptionHandler.isSubscribed(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    identity,
                    eventMappingId
                )
            )
                subscribers.push(identity)
        }
        return subscribers
    }

    protected async getEventMapping(
        externalSystemConfigurationId: string,
        externalSystemName: string,
        externalSystemResponseName: string
    ): Promise<string | null> {
        const externalSystemResponseId = await this.responseHandler.getResponse(
            this.externalSystemName,
            externalSystemResponseName
        )
        if (!externalSystemResponseId) return null

        return await this.mappingHandler.getMapping(
            externalSystemName,
            externalSystemConfigurationId,
            externalSystemResponseId
        )
    }

    protected async isNewNotification(
        externalIdentityId: string,
        eventMappingId: string,
        notification: any
    ): Promise<boolean> {
        const notificationString = JSON.stringify(notification)
        return await this.stateHandler.isNewNotification(
            externalIdentityId,
            eventMappingId,
            notificationString
        )
    }

    protected async updateNotificationState(
        externalIdentityId: string,
        eventMappingId: string,
        notification: any
    ): Promise<boolean> {
        const notificationString = JSON.stringify(notification)
        const result = await this.stateHandler.addState(
            externalIdentityId,
            eventMappingId,
            notificationString
        )
        return result
    }
}
