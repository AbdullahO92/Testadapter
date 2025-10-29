/// <reference path="../types/prisma-augment.d.ts" />
import { Test, TestingModule } from '@nestjs/testing'
import { GenericAdapterService } from './generic-adapter.service'
import { ExternalSystemRepository } from '../externalsystem/externalsystem.repository'
import { TranslationService } from '../translation/translation.service'
import { StorageHandler } from '../storagehandler/storagehandler'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationDto } from '../event/event.dto'

describe('GenericAdapterService', () => {
    let service: GenericAdapterService

    const mockExternalSystemRepository = {
        findByName: jest.fn(),
    }

    const mockTranslationService = {
        translateBodyToCard: jest.fn(),
    }

    const mockStorageHandler = {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
    }

    const mockPrismaService: any = {
        user: {
            findUnique: jest.fn(),
        },
    }

    beforeEach(async () => {
        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenericAdapterService,
                {
                    provide: ExternalSystemRepository,
                    useValue: mockExternalSystemRepository,
                },
                { provide: TranslationService, useValue: mockTranslationService },
                { provide: StorageHandler, useValue: mockStorageHandler },
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile()

        service = module.get(GenericAdapterService)
    })

    describe('preview', () => {
        const baseUser = {
            id: 'user-1',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        }

        const responseWelcome = {
            id: 'resp-1',
            externalSystemId: 'ext-1',
            internalName: 'welcome',
            displayName: 'Welcome',
            description: null,
        }

        it('throws NotFoundException when user does not exist', async () => {
            mockPrismaService.user.findUnique.mockResolvedValueOnce(null)

            await expect(
                service.preview('canvas', {
                    userId: 'missing-user',
                    responseInternalName: 'welcome',
                    payload: {},
                })
            ).rejects.toThrow('User with id')
            expect(mockPrismaService.user.findUnique).toHaveBeenCalled()
        })

        it('throws NotFoundException when external system not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValueOnce(baseUser)
            mockExternalSystemRepository.findByName.mockResolvedValueOnce(null)

            await expect(
                service.preview('unknown-vendor', {
                    userId: baseUser.id,
                    responseInternalName: 'welcome',
                    payload: {},
                })
            ).rejects.toThrow('External system with name')
            expect(mockExternalSystemRepository.findByName).toHaveBeenCalledWith(
                'unknown-vendor',
                true,
                true
            )
        })

        it('throws NotFoundException when response internal name not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValueOnce(baseUser)
            mockExternalSystemRepository.findByName.mockResolvedValueOnce({
                responses: [
                    {
                        ...responseWelcome,
                        internalName: 'other-response',
                    },
                ],
            })

            await expect(
                service.preview('canvas', {
                    userId: baseUser.id,
                    responseInternalName: 'welcome',
                    payload: {},
                })
            ).rejects.toThrow('Response with internal name')
        })

        it('returns preview result and caches notification', async () => {
            const notification = new NotificationDto(baseUser.id, 5, null, {
                hello: 'world',
            })

            mockPrismaService.user.findUnique.mockResolvedValueOnce(baseUser)
            mockExternalSystemRepository.findByName.mockResolvedValueOnce({
                responses: [responseWelcome],
            })
            mockTranslationService.translateBodyToCard.mockReturnValueOnce(
                notification
            )
            mockStorageHandler.set.mockResolvedValueOnce(null)

            const result = await service.preview('canvas', {
                userId: baseUser.id,
                responseInternalName: 'welcome',
                payload: { x: 1 },
            })

            const expectedKey = `generic-adapter:${baseUser.id}:welcome`

            expect(result.cacheKey).toBe(expectedKey)
            expect(result.notification).toEqual(notification)
            expect(result.response).toEqual(responseWelcome)

            expect(mockExternalSystemRepository.findByName).toHaveBeenCalledWith(
                'canvas',
                true,
                true
            )
            expect(
                mockTranslationService.translateBodyToCard
            ).toHaveBeenCalled()
            expect(mockStorageHandler.set).toHaveBeenCalledWith(
                expectedKey,
                JSON.stringify(notification),
                60 * 15
            )
        })
    })

    describe('readFromCache', () => {
        it('returns null when nothing in cache', async () => {
            mockStorageHandler.get.mockResolvedValueOnce(null)
            const out = await service.readFromCache('k')
            expect(out).toBeNull()
        })

        it('parses cached notification json', async () => {
            const dto = new NotificationDto('user-2', 8, null, { a: 1 })
            mockStorageHandler.get.mockResolvedValueOnce(JSON.stringify(dto))

            const out = await service.readFromCache('some-key')
            expect(out).toEqual(dto)
        })

        it('handles malformed json by deleting cache and returning null', async () => {
            const warnSpy = jest.spyOn<any, any>(
                // @ts-ignore - access private logger for spying
                (service as any).logger,
                'warn'
            )
            mockStorageHandler.get.mockResolvedValueOnce('not-json')
            mockStorageHandler.delete.mockResolvedValueOnce(true)

            const out = await service.readFromCache('bad-key')
            expect(out).toBeNull()
            expect(warnSpy).toHaveBeenCalled()
            expect(mockStorageHandler.delete).toHaveBeenCalledWith('bad-key')
        })
    })
})
