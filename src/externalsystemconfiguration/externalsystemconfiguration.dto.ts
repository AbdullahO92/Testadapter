import {
    ExternalSystemConfiguration,
    EventMapping,
    ExternalIdentity,
} from '@prisma/client'
import { EventMappingDto } from 'src/eventmapping/eventmapping.dto'
import { ExternalIdentityDto } from 'src/externalidentity/externalidentity.dto'

export class ExternalSystemConfigurationDto {
    public readonly id: string
    public readonly externalSystemId: string
    public readonly instituteId: string
    public readonly domain: string
    public readonly notificationsEnabled: Boolean
    public readonly requestsEnabled: Boolean
    public readonly setupTimestamp: Date
    public readonly lastUpdated: Date

    public externalIdentities: ExternalIdentityDto[] = []
    public eventMappings: EventMappingDto[] = []

    constructor(
        externalSystemConfiguration: ExternalSystemConfiguration,
        externalIdentities: ExternalIdentity[] = [],
        eventMappings: EventMapping[] = []
    ) {
        this.id = externalSystemConfiguration.id
        this.externalSystemId = externalSystemConfiguration.externalSystemId
        this.instituteId = externalSystemConfiguration.instituteId
        this.domain = externalSystemConfiguration.domain
        this.notificationsEnabled =
            externalSystemConfiguration.notificationsEnabled
        this.requestsEnabled = externalSystemConfiguration.requestsEnabled
        this.setupTimestamp = externalSystemConfiguration.setupTimestamp
        this.lastUpdated = externalSystemConfiguration.lastUpdated

        externalIdentities.forEach((identity) => {
            this.externalIdentities.push(new ExternalIdentityDto(identity))
        })

        eventMappings.forEach((mapping) => {
            this.eventMappings.push(new EventMappingDto(mapping))
        })
    }
}
