import {
    ExternalSystem,
    ExternalSystemResponse,
    ExternalSystemConfiguration,
} from '@prisma/client'
import { ExternalSystemConfigurationDto } from 'src/externalsystemconfiguration/externalsystemconfiguration.dto'
import { ExternalSystemResponseDto } from 'src/externalsystemresponse/externalsystemresponse.dto'

export class ExternalSystemDto {
    public readonly id: string
    public readonly name: string
    public readonly minimumVersion: string
    public readonly description: string | null

    public responses: ExternalSystemResponseDto[] | null = []
    public externalSystemConfigurations:
        | ExternalSystemConfigurationDto[]
        | null = []

    constructor(
        externalSystem: ExternalSystem,
        responses: ExternalSystemResponse[] | null = null,
        externalSystemConfigurations:
            | ExternalSystemConfiguration[]
            | null = null
    ) {
        this.id = externalSystem.id
        this.name = externalSystem.name
        this.minimumVersion = externalSystem.minimumVersion
        this.description = externalSystem.description

        if (responses) {
            this.responses = []
            responses.forEach((response) => {
                this.responses.push(new ExternalSystemResponseDto(response))
            })
        }

        if (externalSystemConfigurations) {
            this.externalSystemConfigurations = []
            externalSystemConfigurations.forEach((externalSystem) => {
                this.externalSystemConfigurations.push(
                    new ExternalSystemConfigurationDto(externalSystem)
                )
            })
        }
    }
}
