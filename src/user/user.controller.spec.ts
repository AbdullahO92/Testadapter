import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'

describe('UserController', () => {
    let controller: UserController
    let service: UserService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn(),
                        update: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        delete: jest.fn(),
                        updatePrivacy: jest.fn(),
                        updateTerms: jest.fn(),
                        getAgreements: jest.fn(),
                    },
                },
            ],
        }).compile()

        controller = module.get<UserController>(UserController)
        service = module.get<UserService>(UserService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('create', () => {
        it('should create a user', async () => {
            const user: Partial<User> = { id: 'test-id' }
            jest.spyOn(service, 'create').mockResolvedValue(user as User)

            expect(await controller.create(user as User)).toBe(user)
            expect(service.create).toHaveBeenCalledWith(user)
        })

        it('should throw BadRequestException on error', async () => {
            const user: Partial<User> = { id: 'test-id' }
            jest.spyOn(service, 'create').mockRejectedValue(
                new Error('Database error')
            )

            await expect(controller.create(user as User)).rejects.toThrow(
                BadRequestException
            )
        })

        it('should create a user with all properties', async () => {
            const now = new Date()
            const user: Partial<User> = {
                id: '123',
                isActive: true,
                termsAgreedAt: now,
                privacyAgreedAt: now,
            }
            jest.spyOn(service, 'create').mockResolvedValue(user as User)

            const result = await controller.create(user as User)

            expect(result).toBe(user)
            expect(service.create).toHaveBeenCalledWith(user)
        })

        it('should validate user input before creation', async () => {
            const user: Partial<User> = { isActive: false }
            jest.spyOn(service, 'create').mockImplementation(async (input) => {
                if (!input.id) {
                    // This simulates validation that would happen in the service
                    throw new Error('User ID is required')
                }
                return input as User
            })

            await expect(controller.create(user as User)).rejects.toThrow(
                BadRequestException
            )
        })
    })

    describe('update', () => {
        it('should update a user', async () => {
            const user: Partial<User> = {
                id: '1',
                isActive: true,
                privacyAgreedAt: new Date(),
                termsAgreedAt: new Date(),
            }
            jest.spyOn(service, 'update').mockResolvedValue(user as User)

            expect(await controller.update(user as User)).toBe(user)
            expect(service.update).toHaveBeenCalledWith(user)
        })

        it('should throw BadRequestException on error', async () => {
            const user: Partial<User> = { id: '1' }
            jest.spyOn(service, 'update').mockRejectedValue(
                new BadRequestException('Database error')
            )

            await expect(controller.update(user as User)).rejects.toThrow(
                BadRequestException
            )
        })
    })

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users: Partial<User>[] = [{ id: '1' }]
            jest.spyOn(service, 'findAll').mockResolvedValue(users as User[])

            expect(await controller.findAll()).toBe(users)
        })

        it('should return an empty array when no users exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([])

            expect(await controller.findAll()).toEqual([])
            expect(service.findAll).toHaveBeenCalled()
        })

        it('should handle errors from service', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(
                new Error('Database connection failed')
            )

            // The controller method doesn't explicitly handle errors for findAll
            // so we're expecting the error to propagate
            await expect(controller.findAll()).rejects.toThrow(
                'Database connection failed'
            )
        })
    })

    describe('findOne', () => {
        it('should return a user when found', async () => {
            const user: Partial<User> = { id: '1' }
            jest.spyOn(service, 'findOne').mockResolvedValue(user as User)

            expect(await controller.findOne('1')).toBe(user)
            expect(service.findOne).toHaveBeenCalledWith('1')
        })

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null)

            await expect(controller.findOne('1')).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(service, 'delete').mockResolvedValue(undefined)

            await controller.remove('1')
            expect(service.delete).toHaveBeenCalledWith('1')
        })
    })

    describe('updatePrivacyAgreed', () => {
        it('should update privacy agreement', async () => {
            const dto = { userId: '1' }
            jest.spyOn(service, 'updatePrivacy').mockResolvedValue(undefined)

            const result = await controller.updatePrivacyAgreed(dto)
            expect(service.updatePrivacy).toHaveBeenCalledWith(dto)
            expect(result).toEqual({
                message: 'Privacy terms updated successfully',
            })
        })

        it('should throw BadRequestException on error', async () => {
            const dto = { userId: '1' }
            jest.spyOn(service, 'updatePrivacy').mockRejectedValue(
                new Error('Database error')
            )

            await expect(controller.updatePrivacyAgreed(dto)).rejects.toThrow(
                BadRequestException
            )
        })
    })

    describe('updateTerms', () => {
        it('should update terms agreement', async () => {
            const dto = { userId: '1' }
            jest.spyOn(service, 'updateTerms').mockResolvedValue(undefined)

            const result = await controller.updateTerms(dto)
            expect(service.updateTerms).toHaveBeenCalledWith(dto)
            expect(result).toEqual({ message: 'Terms updated successfully' })
        })

        it('should throw BadRequestException on error', async () => {
            const dto = { userId: '1' }
            jest.spyOn(service, 'updateTerms').mockRejectedValue(
                new Error('Database error')
            )

            await expect(controller.updateTerms(dto)).rejects.toThrow(
                BadRequestException
            )
        })
    })

    describe('getAgreements', () => {
        it('should return user agreements', async () => {
            const agreements = {
                termsAgreedAt: new Date(),
                privacyAgreedAt: new Date(),
            }
            jest.spyOn(service, 'getAgreements').mockResolvedValue(agreements)

            expect(await controller.getAgreements('1')).toBe(agreements)
            expect(service.getAgreements).toHaveBeenCalledWith('1')
        })

        it('should throw BadRequestException on error', async () => {
            jest.spyOn(service, 'getAgreements').mockRejectedValue(
                new BadRequestException('User not found')
            )

            await expect(controller.getAgreements('1')).rejects.toThrow(
                BadRequestException
            )
        })
    })
})
