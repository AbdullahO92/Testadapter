import { Test, TestingModule } from '@nestjs/testing'
import { IntegrationService } from './integration.service'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemConfiguration } from '@prisma/client'


describe('IntegrationService', () => {
    let service: IntegrationService
    let prismaService: PrismaService

    beforeEach(async () => {
        const mockPrismaService = {
            externalSystemConfiguration: {
                create: jest.fn(),
                update: jest.fn(),
                findMany: jest.fn(),
                delete: jest.fn(),
            },
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IntegrationService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile()

        service = module.get<IntegrationService>(IntegrationService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should create a new integration', async () => {
            const integration: ExternalSystemConfiguration = {
                id: '00000000-0000-0000-0000-000000000001',
                instituteId: '00000000-0000-0000-0000-000000000001',
                domain: 'https://canvas.cy2.com',
                requestsEnabled: true,
                notificationsEnabled: true,
                setupTimestamp: new Date(),
                lastUpdated: new Date(),
                externalSystemId: '00000000-0000-0000-0000-000000000001',
            } as ExternalSystemConfiguration
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'create'
                )
                .mockResolvedValue(
                integration
            )

            const result = await service.create(integration)
            expect(result).toEqual(integration)
            expect(
                prismaService.externalSystemConfiguration.create
            ).toHaveBeenCalledWith({
                data: integration,
            })
        })

        it('should throw an error if creation fails', async () => {
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'create'
                )
                .mockRejectedValue(
                 new Error('Create error')
            )

            await expect(
                service.create({
                    id: '00000000-0000-0000-0000-000000000001',
                    instituteId: '00000000-0000-0000-0000-000000000001',
                    domain: 'https://canvas.cy2.com',
                    requestsEnabled: true,
                    notificationsEnabled: true,
                    setupTimestamp: new Date(),
                    lastUpdated: new Date(),
                    externalSystemId:
                        '00000000-0000-0000-0000-000000000001',
                } as ExternalSystemConfiguration)
            ).rejects.toThrow('Create error')
        })
    })

    describe('update', () => {
        it('should update an existing integration', async () => {
            const integration: ExternalSystemConfiguration = {
                id: '00000000-0000-0000-0000-000000000001',
                instituteId: '00000000-0000-0000-0000-000000000001',
                domain: 'https://canvas.cy2.com',
                requestsEnabled: true,
                notificationsEnabled: true,
                setupTimestamp: new Date(),
                lastUpdated: new Date(),
                externalSystemId: '00000000-0000-0000-0000-000000000001',
            } as ExternalSystemConfiguration
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'update'
                )
                .mockResolvedValue(
                integration
            )

            const result = await service.update(integration)
            expect(result).toEqual(integration)
            expect(
                prismaService.externalSystemConfiguration.update
            ).toHaveBeenCalledWith({
                where: { id: integration.id },
                data: integration,
            })
        })

        it('should throw an error if update fails', async () => {
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'update'
                )
                .mockRejectedValue(
                 new Error('Update error')
            )

            await expect(
                service.update({
                    id: '00000000-0000-0000-0000-000000000001',
                    instituteId: '00000000-0000-0000-0000-000000000001',
                    domain: 'https://canvas.cy2.com',
                    requestsEnabled: true,
                    notificationsEnabled: true,
                    setupTimestamp: new Date(),
                    lastUpdated: new Date(),
                    externalSystemId:
                        '00000000-0000-0000-0000-000000000001',
                } as ExternalSystemConfiguration)
            ).rejects.toThrow('Update error')
        })
    })

    describe('findAll', () => {
        it('should return all integrations', async () => {
            const integrations: ExternalSystemConfiguration [] = [
                {
                    id: '00000000-0000-0000-0000-000000000001',
                    instituteId: '00000000-0000-0000-0000-000000000001',
                    domain: 'https://canvas.cy2.com',
                    requestsEnabled: true,
                    notificationsEnabled: true,
                    setupTimestamp: new Date(),
                    lastUpdated: new Date(),
                    externalSystemId:
                        '00000000-0000-0000-0000-000000000001',
                } as ExternalSystemConfiguration,
            ]
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'findMany'
                )
                .mockResolvedValue(                integrations
            )

            const result = await service.findAll()
            expect(result).toEqual(integrations)
            expect(
                prismaService.externalSystemConfiguration.findMany
            ).toHaveBeenCalledWith({})
        })
    })

    describe('delete', () => {
        it('should delete an integration by id', async () => {
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'delete'
                )
                .mockResolvedValue(
                undefined
            )

            await service.delete('1')
            expect(
                prismaService.externalSystemConfiguration.delete
            ).toHaveBeenCalledWith({
                where: { id: '1' },
            })
        })

        it('should throw an error if deletion fails', async () => {
            jest
                .spyOn(
                    prismaService.externalSystemConfiguration,
                    'delete'
                )
                .mockRejectedValue(
                    new Error('Delete error')
            )

            await expect(service.delete('1')).rejects.toThrow('Delete error')
        })
    })
})
