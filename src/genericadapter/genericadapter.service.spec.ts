import { Test, TestingModule } from '@nestjs/testing'
import { GenericAdapterService } from './genericadapter.service'
import { ExternalSystemRepository } from '../externalsystem/externalsystem.repository'
import { TranslationService } from '../translation/translation.service'
import { StorageHandler } from '../storagehandler/storagehandler'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemResponseDto } from '../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterConnectorRegistry } from './connectors/connector.registry'
import { ExternalSystemConfigurationRepository } from '../externalsystemconfiguration/externalsystemconfiguration.repository'
import { EventService } from '../event/event.service'
import { EventMappingRepository } from '../eventmapping/eventmapping.service'
import { GenericAdapterPreviewDto } from './dto/genericadapter-preview.dto'
import { NotificationDto } from '../event/event.dto'

class MockConnector {
    readonly vendor = 'canvas'
    supports(): boolean {
        return true
    }
    buildPayload = jest
        .fn()
        .mockImplementation(async (preview: GenericAdapterPreviewDto) => {
            return {
                title: preview.payload?.title ?? 'Announcement',
            }
        })
}

describe('GenericAdapterService', () => {
    let service: GenericAdapterService
    let storageHandler: { set: jest.Mock; get: jest.Mock; delete: jest.Mock }
    let connector: MockConnector
    let registry: { resolve: jest.Mock }
    let translationService: { translateBodyToCard: jest.Mock }
    let eventService: { sendNotification: jest.Mock }

    beforeEach(async () => {
        connector = new MockConnector()
        registry = {
            resolve: jest.fn().mockReturnValue(connector),
        }
        translationService = {
            translateBodyToCard: jest.fn().mockReturnValue(
                new NotificationDto('user-1', 3, null, { title: 'Announcement' })
            ),
        }
        storageHandler = {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
        }
        eventService = {
            sendNotification: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenericAdapterService,
                { provide: ExternalSystemRepository, useValue: createSystemRepo() },
                { provide: TranslationService, useValue: translationService },
                { provide: StorageHandler, useValue: storageHandler },
                { provide: PrismaService, useValue: createPrisma() },
                {
                    provide: ExternalSystemConfigurationRepository,
                    useValue: createConfigurationRepo(),
                },
                { provide: EventService, useValue: eventService },
                {
                    provide: EventMappingRepository,
                    useValue: createEventMappingRepo(),
                },
                {
                    provide: GenericAdapterConnectorRegistry,
                    useValue: registry,
                },
            ],
        }).compile()

        service = module.get<GenericAdapterService>(GenericAdapterService)
    })

    it('generates and caches a preview notification', async () => {
        const preview = new GenericAdapterPreviewDto()
        preview.userId = 'user-1'
        preview.responseInternalName = 'canvas_announcement'
        preview.payload = { title: 'Welcome' }

        const result = await service.preview('canvas', preview)

        expect(result.notification).toBeInstanceOf(NotificationDto)
        expect(result.response.internalName).toBe('canvas_announcement')
        expect(result.normalizedPayload).toEqual({ title: 'Welcome' })
        expect(storageHandler.set).toHaveBeenCalledTimes(1)
        expect(translationService.translateBodyToCard).toHaveBeenCalledWith(
            expect.any(ExternalSystemResponseDto),
            expect.anything(),
            { title: 'Welcome' }
        )
        expect(registry.resolve).toHaveBeenCalledWith('canvas')
    })

    it('dispatches a notification through the event service', async () => {
        const preview = new GenericAdapterPreviewDto()
        preview.userId = 'user-1'
        preview.responseInternalName = 'canvas_announcement'
        preview.configurationId = '00000000-0000-0000-0000-000000000001'
        preview.payload = { title: 'Important update' }

        const result = await service.dispatch('canvas', preview)

        expect(eventService.sendNotification).toHaveBeenCalledWith(
            ['external-1'],
            'event-mapping-1',
            { title: 'Important update' }
        )
        expect(result.eventMappingId).toBe('event-mapping-1')
        expect(result.recipients).toBe(1)
        expect(storageHandler.set).toHaveBeenCalled()
    })
})

function createSystemRepo() {
    const response = new ExternalSystemResponseDto({
        id: 'response-1',
        externalSystemId: 'system-1',
        internalName: 'canvas_announcement',
        displayName: 'Announcement',
        description: null,
    } as any)

    return {
        findByName: jest.fn().mockResolvedValue({
            id: 'system-1',
            name: 'canvas',
            responses: [response],
            externalSystemConfigurations: [],
        }),
    }
}

function createPrisma() {
    return {
        user: {
            findUnique: jest.fn().mockResolvedValue({
                id: 'user-1',
            }),
        },
    }
}

function createConfigurationRepo() {
    return {
        findManyByExternalSystemId: jest.fn().mockResolvedValue([
            {
                id: '00000000-0000-0000-0000-000000000001',
                externalIdentities: [
                    {
                        id: 'external-1',
                    },
                ],
            },
        ]),
    }
}

function createEventMappingRepo() {
    return {
        findByConfigurationAndResponse: jest
            .fn()
            .mockResolvedValue({ id: 'event-mapping-1' }),
    }
}