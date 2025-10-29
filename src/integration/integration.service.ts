import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemConfiguration } from '@prisma/client'

@Injectable()
export class IntegrationService {
    constructor(private prisma: PrismaService) {}

    async create(
        integration: ExternalSystemConfiguration
    ): Promise<ExternalSystemConfiguration> {
        try {
            return await this.prisma.externalSystemConfiguration.create({
                data: integration,
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async update(
        integration: ExternalSystemConfiguration
    ): Promise<ExternalSystemConfiguration> {
        try {
            return await this.prisma.externalSystemConfiguration.update({
                where: { id: integration.id },
                data: integration,
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async findAll(): Promise<ExternalSystemConfiguration[]> {
        return this.prisma.externalSystemConfiguration.findMany({
            //include: { userPreference: true },
        })
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.externalSystemConfiguration.delete({
                where: { id },
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
