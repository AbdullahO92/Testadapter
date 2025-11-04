import { TestingModule, Test } from '@nestjs/testing'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from './user.service'
import { User } from '@prisma/client'

describe('UserService', () => {
    let service: UserService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, PrismaService],
        }).compile()

        service = module.get<UserService>(UserService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should create a user', async () => {
            const user: User = {
                id: '1',
                isActive: true,
                privacyAgreedAt: new Date(),
                termsAgreedAt: new Date(),
                instituteId: '00000000-0000-0000-0000-000000000001',
            }
            jest.spyOn(prisma.user, 'create').mockResolvedValue(user)

            const result = await service.create(user)
            expect(result).toEqual(user)
            expect(prisma.user.create).toHaveBeenCalledWith({ data: user })
        })
    })

    describe('update', () => {
        it('should update a user', async () => {
            const user: User = {
                id: '1',
                isActive: true,
                privacyAgreedAt: new Date(),
                termsAgreedAt: new Date(),
                instituteId: '00000000-0000-0000-0000-000000000001',
            }
            jest.spyOn(prisma.user, 'update').mockResolvedValue(user)

            const result = await service.update(user)
            expect(result).toEqual(user)
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: user.id },
                data: { ...user },
            })
        })
    })

    describe('findAll', () => {
        it('should return all users', async () => {
            const users: User[] = [
                {
                    id: '1',
                    isActive: true,
                    privacyAgreedAt: new Date(),
                    termsAgreedAt: new Date(),
                    instituteId: '00000000-0000-0000-0000-000000000001',

                },
            ]
            jest.spyOn(prisma.user, 'findMany').mockResolvedValue(users)

            const result = await service.findAll()
            expect(result).toEqual(users)
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                include: { userPreference: true, externalIdentity: true },
            })
        })
    })

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user: User = {
                id: '1',
                isActive: true,
                privacyAgreedAt: new Date(),
                termsAgreedAt: new Date(),
                instituteId: '00000000-0000-0000-0000-000000000001',

            }
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user)

            const result = await service.findOne('1')
            expect(result).toEqual(user)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                include: {
                    userPreference: { include: {} },
                    externalIdentity: true,
                },
            })
        })

        it('should return null if user not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)

            const result = await service.findOne('1')
            expect(result).toBeNull()
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                include: {
                    userPreference: { include: {} },
                    externalIdentity: true,
                },
            })
        })
    })

    describe('delete', () => {
        it('should delete a user', async () => {
            jest.spyOn(prisma.user, 'delete').mockResolvedValue(undefined)

            await service.delete('1')
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            })
        })
    })
})
