import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserPreference } from '@prisma/client'

@Injectable()
export class UserPreferenceService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<UserPreference[]> {
        return this.prisma.userPreference.findMany({
            include: { user: true },
        })
    }

    async findOne(id: string): Promise<UserPreference | null> {
        try {
            return this.prisma.userPreference.findUnique({
                where: { id },
                include: {
                    user: true,
                    //integrations: true,
                },
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async create(userPreference: UserPreference): Promise<UserPreference> {
        try {
            return this.prisma.userPreference.create({
                data: userPreference,
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async update(userPreference: UserPreference): Promise<UserPreference> {
        try {
            return this.prisma.userPreference.update({
                where: { id: userPreference.id },
                data: userPreference,
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.userPreference.delete({
                where: { id },
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
