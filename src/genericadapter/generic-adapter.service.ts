import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { ExternalSystemRepository } from '../externalsystem/externalsystem.repository'
import { TranslationService } from '../translation/translation.service'
import { StorageHandler } from '../storagehandler/storagehandler'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemResponseDto } from '../externalsystemresponse/externalsystemresponse.dto'
import { NotificationDto } from '../event/event.dto'
import { UserDto } from '../user/user.dto'
import { GenericAdapterPreviewDto } from './dto/generic-adapter-preview.dto'
import { GenericAdapterConnectorRegistry } from './connectors/connector.registry'
import { GenericAdapterConnector } from './connectors/generic-adapter.connector'
import { ExternalSystemDto } from '../externalsystem/externalsystem.dto'
import { ExternalSystemConfigurationRepository } from '../externalsystemconfiguration/externalsystemconfiguration.repository'
import { ExternalSystemConfigurationDto } from '../externalsystemconfiguration/externalsystemconfiguration.dto'
import { EventService } from '../event/event.service'
import { EventMappingRepository } from '../eventmapping/eventmapping.service'
import { EventMappingDto } from '../eventmapping/eventmapping.dto'

const CACHE_TTL_SECONDS = 60 * 15 // 15 minutes

interface PreviewResult {
    cacheKey: string
    notification: NotificationDto
    response: ExternalSystemResponseDto
    normalizedPayload: Record<string, any>
}

interface PreviewContext extends PreviewResult {
    externalSystem: ExternalSystemDto
    user: UserDto
}

@Injectable()
export class GenericAdapterService {
    private readonly logger = new Logger(GenericAdapterService.name)

    constructor(
        private readonly externalSystemRepository: ExternalSystemRepository,
        private readonly translationService: TranslationService,
        private readonly storageHandler: StorageHandler,
        private readonly prisma: PrismaService,
        private readonly configurationRepository: ExternalSystemConfigurationRepository,
        private readonly eventService: EventService,
        private readonly eventMappingRepository: EventMappingRepository,
        private readonly connectorRegistry: GenericAdapterConnectorRegistry
    ) {}

    async preview(
        vendorName: string,
        preview: GenericAdapterPreviewDto
    ): Promise<PreviewResult> {
        try {
            const context = await this.buildPreviewContext(vendorName, preview)

            await this.storageHandler.set(
                context.cacheKey,
                JSON.stringify(context.notification),
                CACHE_TTL_SECONDS
            )

            this.logger.debug(
                `Stored preview payload for ${vendorName} in cache key ${context.cacheKey}`
            )

            return {
                cacheKey: context.cacheKey,
                notification: context.notification,
                response: context.response,
                normalizedPayload: context.normalizedPayload,
            }
        } catch (error) {
            this.handleAdapterError('preview', vendorName, error)
        }
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

    async dispatch(
        vendorName: string,
        preview: GenericAdapterPreviewDto
    ): Promise<{ cacheKey: string; eventMappingId: string; recipients: number }> {
        try {
            const context = await this.buildPreviewContext(vendorName, preview)

            await this.storageHandler.set(
                context.cacheKey,
                JSON.stringify(context.notification),
                CACHE_TTL_SECONDS
            )

            const configuration = await this.resolveConfiguration(
                context.externalSystem,
                preview.configurationId
            )

            const eventMapping = await this.resolveEventMapping(
                configuration,
                context.response
            )

            const externalIdentities =
                configuration.externalIdentities?.map((identity) => identity.id) ?? []

            if (!externalIdentities.length) {
                throw new UnauthorizedException(
                    'No external identities found for the selected configuration.'
                )
            }

            await this.eventService.sendNotification(
                externalIdentities,
                eventMapping.id,
                context.normalizedPayload
            )

            this.logger.debug(
                `Queued notification for vendor ${vendorName} using mapping ${eventMapping.id}`
            )

            return {
                cacheKey: context.cacheKey,
                eventMappingId: eventMapping.id,
                recipients: externalIdentities.length,
            }
        } catch (error) {
            this.handleAdapterError('dispatch', vendorName, error)
        }
    }

    private async loadUser(userId: string): Promise<UserDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException(
                `User with id "${userId}" was not found.`
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
                `Response with internal name "${internalName}" was not found.`
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

    private resolveConnector(vendorName: string): GenericAdapterConnector {
        const connector = this.connectorRegistry.resolve(vendorName)
        if (!connector) {
            throw new NotFoundException(
                `No connector registered for vendor "${vendorName}".`
            )
        }
        return connector
    }

    private async buildPreviewContext(
        vendorName: string,
        preview: GenericAdapterPreviewDto
    ): Promise<PreviewContext> {
        const user = await this.loadUser(preview.userId)
        const externalSystem = await this.externalSystemRepository.findByName(
            vendorName,
            true,
            true
        )

        if (!externalSystem) {
            throw new NotFoundException(
                `External system with name "${vendorName}" was not found.`
            )
        }

        const response = this.resolveResponse(
            externalSystem.responses ?? [],
            preview.responseInternalName
        )

        const connector = this.resolveConnector(vendorName)
        const normalizedPayload = await connector.buildPayload(preview, response)

        const notification = this.translationService.translateBodyToCard(
            response,
            user,
            normalizedPayload
        )

        if (!notification) {
            throw new NotFoundException(
                `No translator found for response "${response.internalName}".`
            )
        }

        const cacheKey = this.buildCacheKey(user.id, response.internalName)

        return {
            cacheKey,
            notification,
            response,
            normalizedPayload,
            externalSystem,
            user,
        }
    }

    private async resolveConfiguration(
        externalSystem: ExternalSystemDto,
        configurationId?: string
    ): Promise<ExternalSystemConfigurationDto> {
        const configurations =
            await this.configurationRepository.findManyByExternalSystemId(
                externalSystem.id,
                true,
                true
            )

        if (!configurations || configurations.length === 0) {
            throw new NotFoundException(
                `No configurations found for external system "${externalSystem.name}".`
            )
        }

        if (configurationId) {
            const configuration = configurations.find(
                (item) => item.id === configurationId
            )
            if (!configuration) {
                throw new NotFoundException(
                    `Configuration "${configurationId}" does not exist for vendor "${externalSystem.name}".`
                )
            }
            return configuration
        }

        return configurations[0]
    }

    private async resolveEventMapping(
        configuration: ExternalSystemConfigurationDto,
        response: ExternalSystemResponseDto
    ): Promise<EventMappingDto> {
        const mapping = await this.eventMappingRepository.findByConfigurationAndResponse(
            configuration.id,
            response.id
        )

        if (!mapping) {
            throw new NotFoundException(
                `No event mapping found for response "${response.internalName}" within configuration "${configuration.id}".`
            )
        }

        return mapping
    }

    private handleAdapterError(
        action: 'preview' | 'dispatch',
        vendorName: string,
        error: unknown
    ): never {
        const normalizedError =
            error instanceof Error ? error : new Error(String(error))

        this.logger.error(
            `Failed to ${action} payload for vendor ${vendorName}: ${normalizedError.message}`,
            normalizedError.stack
        )

        throw normalizedError
    }
}
