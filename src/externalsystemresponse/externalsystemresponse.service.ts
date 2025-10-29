import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExternalSystemResponseDto } from './externalsystemresponse.dto'

@Injectable()
export class ExternalSystemResponseRepository {
    constructor(private prisma: PrismaService) {}

    async findManyByExternalSystemId(
        externalSystemId: string
    ): Promise<ExternalSystemResponseDto[] | null> {
        try {
            const result = await this.prisma.externalSystemResponse.findMany({
                where: {
                    externalSystemId: externalSystemId,
                },
            })
            if (!result) return null

            const responses: ExternalSystemResponseDto[] = []
            for (const response of result) {
                responses.push(new ExternalSystemResponseDto(response))
            }
            return responses
        } catch (e) {
            Logger.error(
                `Error fetching responses for external system ${externalSystemId}: ${e.message}`
            )
        }
        return null
    }

    async findByNameAndExternalSystemId(
        name: string,
        externalSystemId: string
    ): Promise<ExternalSystemResponseDto | null> {
        try {
            const result = await this.prisma.externalSystemResponse.findFirst({
                where: {
                    internalName: name,
                    externalSystemId: externalSystemId,
                },
            })
            if (result != null) {
                return new ExternalSystemResponseDto(result)
            }
        } catch (e) {
            Logger.error(
                `Error finding response with name ${name} for external system ${externalSystemId}: ${e.message}`
            )
        }
        return null
    }
}
