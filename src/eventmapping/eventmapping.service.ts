import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EventMapping } from '@prisma/client'
import { EventMappingDto } from './eventmapping.dto'

@Injectable()
export class EventMappingRepository {
    constructor(private prisma: PrismaService) {}

    async findById(
        eventMappingId: string,
        includeResponse: boolean = false
    ): Promise<EventMappingDto | null> {
        try {
            const result = await this.prisma.eventMapping.findUnique({
                where: {
                    id: eventMappingId,
                },
                include: {
                    externalSystemResponse: includeResponse,
                },
            })
            if (!result) return null

            return new EventMappingDto(result, result.externalSystemResponse)
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }

    async findByConfigurationAndResponse(
        dataAdapterId: string,
        adapterResponseId: string
    ): Promise<EventMappingDto | null> {
        try {
            const result = await this.prisma.eventMapping.findFirst({
                where: {
                    externalSystemConfigurationId: dataAdapterId,
                    externalSystemResponseId: adapterResponseId,
                    isTrigger: true,
                },
            })
            if (!result) return null

            return new EventMappingDto(result)
        } catch (e) {
            // TODO: Log instead
            //throw new Error(e.message)
        }
        return null
    }
}
