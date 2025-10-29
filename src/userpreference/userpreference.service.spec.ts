import { TestingModule, Test } from '@nestjs/testing'
import { UserPreferenceService } from './userpreference.service'
import { PrismaService } from '../prisma/prisma.service'
import { UserPreference } from '@prisma/client'

describe('UserPreferenceService', () => {
    let service: UserPreferenceService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserPreferenceService, PrismaService],
        }).compile()

        service = module.get<UserPreferenceService>(UserPreferenceService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findAll', () => {
        it('should return an array of user preferences', async () => {
            const result: UserPreference[] = [
                {
                    id: '1',
                    userId: '1',
                    language: 'en',
                    timezone: 'GMT',
                    pushNotification: true,
                },
            ]
            jest.spyOn(prisma.userPreference, 'findMany').mockResolvedValue(
                result
            )

            expect(await service.findAll()).toBe(result)
        })
    })

    describe('findOne', () => {
        it('should return a single user preference by id', async () => {
            const result: UserPreference = {
                id: '1',
                userId: '1',
                language: 'en',
                timezone: 'GMT',
                pushNotification: true,
            }
            jest.spyOn(prisma.userPreference, 'findUnique').mockResolvedValue(
                result
            )

            expect(await service.findOne('1')).toBe(result)
        })

        it('should throw an error if user preference is not found', async () => {
            jest.spyOn(prisma.userPreference, 'findUnique').mockResolvedValue(
                null
            )

            await expect(service.findOne('1')).resolves.toBeNull()
        })
    })

    describe('create', () => {
        it('should create a new user preference', async () => {
            const userPreference: UserPreference = {
                id: '1',
                userId: '1',
                language: 'en',
                timezone: 'GMT',
                pushNotification: true,
            }
            jest.spyOn(prisma.userPreference, 'create').mockResolvedValue(
                userPreference
            )

            expect(await service.create(userPreference)).toBe(userPreference)
        })
    })

    describe('update', () => {
        it('should update an existing user preference', async () => {
            const userPreference: UserPreference = {
                id: '1',
                userId: '1',
                language: 'en',
                timezone: 'GMT',
                pushNotification: true,
            }
            jest.spyOn(prisma.userPreference, 'update').mockResolvedValue(
                userPreference
            )

            expect(await service.update(userPreference)).toBe(userPreference)
        })

        it('should throw an error if update fails', async () => {
            const userPreference: UserPreference = {
                id: '1',
                userId: '1',
                language: 'en',
                timezone: 'GMT',
                pushNotification: true,
            }
            jest.spyOn(prisma.userPreference, 'update').mockRejectedValue(
                new Error('Update failed')
            )

            await expect(service.update(userPreference)).rejects.toThrow(
                'Update failed'
            )
        })
    })

    describe('delete', () => {
        it('should delete a user preference', async () => {
            jest.spyOn(prisma.userPreference, 'delete').mockResolvedValue(
                undefined
            )

            await expect(service.delete('1')).resolves.toBeUndefined()
        })

        it('should throw an error if delete fails', async () => {
            jest.spyOn(prisma.userPreference, 'delete').mockRejectedValue(
                new Error('Delete failed')
            )

            await expect(service.delete('1')).rejects.toThrow('Delete failed')
        })
    })
})
