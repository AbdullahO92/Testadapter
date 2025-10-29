import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: User): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: user,
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async update(user: User): Promise<User> {
        try {
            return await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    ...user,
                },
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany({
            include: { userPreference: true, externalIdentity: true },
        })
    }

    async findManyByExternalIdentityId(
        externalIdentityIds: string[]
    ): Promise<UserDto[]> {
        const users: UserDto[] = []
        for (const identity of externalIdentityIds) {
            const user = await this.prisma.user.findFirst({
                where: {
                    externalIdentity: {
                        some: {
                            id: identity,
                        },
                    },
                },
            })
            if (!user) continue
            users.push(new UserDto(user))
        }
        return users
    }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                userPreference: {
                    include: {
                        //integrations: true,
                    },
                },
                externalIdentity: true,
            },
        })
    }

    async delete(userId: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id: userId },
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateTerms(dto: { userId: string }): Promise<void> {
        const { userId } = dto
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { termsAgreedAt: new Date() },
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async updatePrivacy(dto: { userId: string }): Promise<void> {
        const { userId } = dto
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { privacyAgreedAt: new Date() },
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async getAgreements(userId: string): Promise<{
        termsAgreedAt: Date | null
        privacyAgreedAt: Date | null
    }> {
        if (!userId) {
            throw new BadRequestException('User ID is required.')
        }
        return await this.prisma.user
            .findFirst({
                where: { id: userId },
                select: {
                    termsAgreedAt: true,
                    privacyAgreedAt: true,
                },
            })
            .then((user) => {
                if (!user) {
                    throw new BadRequestException('User not found.')
                }
                return {
                    termsAgreedAt: user.termsAgreedAt,
                    privacyAgreedAt: user.privacyAgreedAt,
                }
            })
            .catch((e) => {
                throw new BadRequestException(e)
            })
    }
}
