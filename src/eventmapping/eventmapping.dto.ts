import { ExternalSystemResponse, EventMapping } from '@prisma/client'
import { ExternalSystemResponseDto } from 'src/externalsystemresponse/externalsystemresponse.dto'

export class EventMappingDto {
    public readonly id: string
    public readonly externalSystemConfigurationId: string
    public readonly externalSystemResponseId: string
    public readonly name: string
    public readonly summary: string
    public readonly isTrigger: boolean
    public readonly isEnabled: boolean
    public readonly isDefaultEnabled: boolean
    public readonly description: string | null

    public readonly response: ExternalSystemResponseDto | null

    constructor(
        mapping: EventMapping,
        response: ExternalSystemResponse | null = null
    ) {
        this.id = mapping.id
        this.externalSystemConfigurationId =
            mapping.externalSystemConfigurationId
        this.externalSystemResponseId = mapping.externalSystemResponseId
        this.isEnabled = mapping.isEnabled
        this.isDefaultEnabled = mapping.isDefaultEnabled
        this.isTrigger = mapping.isTrigger
        this.name = mapping.name
        this.summary = mapping.summary
        this.description = mapping.description

        if (response != null) {
            this.response = new ExternalSystemResponseDto(response)
        }
    }
}
