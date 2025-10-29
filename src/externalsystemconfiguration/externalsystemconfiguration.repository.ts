import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemConfiguration } from '@prisma/client'
import { ExternalSystemConfigurationDto } from './externalsystemconfiguration.dto'

@Injectable()
export class ExternalSystemConfigurationRepository {
    constructor(private prisma: PrismaService) {}

    async findById(
        externalSystemConfigurationId: string
    ): Promise<ExternalSystemConfigurationDto | null> {
        try {
            const result =
                await this.prisma.externalSystemConfiguration.findFirst({
                    where: {
                        id: externalSystemConfigurationId,
                    },
                })
            if (!result) return null
            return new ExternalSystemConfigurationDto(result)
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }

    async findManyByExternalSystemId(
        externalSystemId: string,
        includeIdentities: boolean = false,
        includeMappings: boolean = false
    ): Promise<ExternalSystemConfigurationDto[] | null> {
        try {
            const result =
                await this.prisma.externalSystemConfiguration.findMany({
                    where: {
                        externalSystemId: externalSystemId,
                    },
                    include: {
                        externalIdentities: includeIdentities,
                        eventMappings: includeMappings,
                    },
                })
            if (!result) return null

            const configurations: ExternalSystemConfigurationDto[] = []
            for (const configuration of result) {
                configurations.push(
                    new ExternalSystemConfigurationDto(
                        configuration,
                        configuration.externalIdentities,
                        configuration.eventMappings
                    )
                )
            }
            return configurations
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }

    async findByInstituteAndExternalSystem(
        instituteId: string,
        externalSystemId: string,
        includeMappings: boolean = false
    ): Promise<ExternalSystemConfigurationDto | null> {
        try {
            const result =
                await this.prisma.externalSystemConfiguration.findFirst({
                    where: {
                        instituteId: instituteId,
                        externalSystemId: externalSystemId,
                    },
                    include: {
                        eventMappings: includeMappings,
                    },
                })
            if (!result) return null

            return new ExternalSystemConfigurationDto(result)
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }
}
