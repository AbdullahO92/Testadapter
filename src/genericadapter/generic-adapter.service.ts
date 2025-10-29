import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ExternalSystemRepository } from '../externalsystem/externalsystem.repository'
import { TranslationService } from '../translation/translation.service'
import { StorageHandler } from '../storagehandler/storagehandler'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemResponseDto } from '../externalsystemresponse/externalsystemresponse.dto'
import { NotificationDto } from '../event/event.dto'
import { UserDto } from '../user/user.dto'
import { GenericAdapterPreviewDto } from './dto/generic-adapter-preview.dto'

const CACHE_TTL_SECONDS = 60 * 15 // 15 minutes

interface PreviewResult {
    cacheKey: string
    notification: NotificationDto
    response: ExternalSystemResponseDto
}

@Injectable()
export class GenericAdapterService {
    private readonly logger = new Logger(GenericAdapterService.name)

    constructor(
        private readonly externalSystemRepository: ExternalSystemRepository,
        private readonly translationService: TranslationService,
        private readonly storageHandler: StorageHandler,
        private readonly prisma: PrismaService
    ) {}

    async preview(
        vendorName: string,
        preview: GenericAdapterPreviewDto
    ): Promise<PreviewResult> {
        const user = await this.loadUser(preview.userId)
        const externalSystem = await this.externalSystemRepository.findByName(
            vendorName,
            true,
            true
        )

        if (!externalSystem) {
            throw new NotFoundException(
                `External system with name \"${vendorName}\" was not found.`
            )
        }

        const response = this.resolveResponse(
            externalSystem.responses ?? [],
            preview.responseInternalName
        )

        const notification = this.translationService.translateBodyToCard(
            response,
            user,
            preview.payload
        )

        const cacheKey = this.buildCacheKey(user.id, response.internalName)
        await this.storageHandler.set(
            cacheKey,
            JSON.stringify(notification),
            CACHE_TTL_SECONDS
        )

        this.logger.debug(
            `Stored preview payload for ${vendorName} in cache key ${cacheKey}`
        )

        return { cacheKey, notification, response }
    }

    async readFromCache(cacheKey: string): Promise<NotificationDto | null> {
        const cached = await this.storageHandler.get(cacheKey)
        if (!cached) {
            return null
        }

        try {
            const parsed = JSON.parse(cached)
            return new NotificationDto(
                parsed.userId,
                parsed.eventId,
                parsed.messageId ?? null,
                parsed.data ?? null
            )
        } catch (error) {
            this.logger.warn(
                `Failed to parse cached payload for key ${cacheKey}: ${error}`
            )
            await this.storageHandler.delete(cacheKey)
            return null
        }
    }

    private async loadUser(userId: string): Promise<UserDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException(
                `User with id \"${userId}\" was not found.`
            )
        }

        return new UserDto(user)
    }

    private resolveResponse(
        responses: ExternalSystemResponseDto[],
        internalName: string
    ): ExternalSystemResponseDto {
        const response = responses.find(
            (item) => item.internalName === internalName
        )

        if (!response) {
            throw new NotFoundException(
                `Response with internal name \"${internalName}\" was not found.`
            )
        }

        return response
    }

    private buildCacheKey(
        userId: string,
        responseInternalName: string
    ): string {
        return `generic-adapter:${userId}:${responseInternalName}`
    }
}
