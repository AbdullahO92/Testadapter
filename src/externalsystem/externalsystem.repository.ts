import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystem } from '@prisma/client'
import { ExternalSystemDto } from './externalsystem.dto'

@Injectable()
export class ExternalSystemRepository {
    constructor(private prisma: PrismaService) {}

    async findByName(
        externalSystemName: string,
        includeResponses: boolean = false,
        includeExternalSystemConfigurations: boolean = false
    ): Promise<ExternalSystemDto | null> {
        try {
            const externalSystem = await this.prisma.externalSystem.findFirst({
                where: {
                    name: externalSystemName,
                },
                include: {
                    externalSystemResponses: includeResponses,
                    externalSystemConfigurations:
                        includeExternalSystemConfigurations,
                },
            })

            if (externalSystem != null) {
                return new ExternalSystemDto(
                    externalSystem,
                    externalSystem.externalSystemResponses,
                    externalSystem.externalSystemConfigurations
                )
            }
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }
}
