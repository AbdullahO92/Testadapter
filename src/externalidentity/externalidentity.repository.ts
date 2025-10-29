import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalIdentity } from '@prisma/client'
import { ExternalIdentityDto } from './externalidentity.dto'

@Injectable()
export class ExternalIdentityRepository {
    constructor(private prisma: PrismaService) {}

    async create(
        userId: string,
        configurarionId: string
    ): Promise<ExternalIdentityDto | null> {
        try {
            const result = await this.prisma.externalIdentity.create({
                data: {
                    userId: userId,
                    externalSystemConfigurationId: configurarionId,
                    lastUpdated: new Date(),
                    enabled: false,
                    externalId: null,
                },
            })
            if (!result) return null

            return new ExternalIdentityDto(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async createPartial(
        userId: string,
        externalSystemConfigurationId: string
    ): Promise<ExternalIdentity | null> {
        try {
            return await this.prisma.externalIdentity.create({
                data: {
                    userId: userId,
                    externalSystemConfigurationId:
                        externalSystemConfigurationId,
                    enabled: false,
                    lastUpdated: new Date(),
                },
            })
        } catch (e) {}
    }

    async updateLastUpdatedTime(
        identityId: string
    ): Promise<ExternalIdentityDto | null> {
        try {
            const result = await this.prisma.externalIdentity.update({
                where: { id: identityId },
                data: {
                    lastUpdated: new Date(),
                },
            })
            if (!result) return null

            return new ExternalIdentityDto(result)
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async updateExternalIdentity(
        identityId: string,
        externalId: string
    ): Promise<ExternalIdentity | null> {
        try {
            return await this.prisma.externalIdentity.update({
                where: { id: identityId },
                data: {
                    externalId: externalId,
                    enabled: true,
                    lastUpdated: new Date(),
                },
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async updateEnabledStatus(
        identityId: string,
        enabled: boolean
    ): Promise<ExternalIdentity | null> {
        try {
            return await this.prisma.externalIdentity.update({
                where: { id: identityId },
                data: {
                    enabled: enabled,
                    lastUpdated: new Date(),
                },
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async findById(
        externalIdentityId: string,
        includeToken: boolean = false,
        includeSubscriptions: boolean = false
    ): Promise<ExternalIdentityDto | null> {
        try {
            const result = await this.prisma.externalIdentity.findFirst({
                where: {
                    id: externalIdentityId,
                },
                include: {
                    token: includeToken,
                    subscriptions: includeSubscriptions,
                },
            })
            if (!result) return null

            return new ExternalIdentityDto(
                result,
                result.subscriptions,
                result.token
            )
        } catch (e) {
            //TODO: add logging instead
            //throw new Error(e.message)
        }
        return null
    }

    async find(
        externalIdentity: string,
        externalSystemConfigurationId: string
    ): Promise<ExternalIdentity | null> {
        try {
            return await this.prisma.externalIdentity.findFirst({
                where: {
                    externalId: externalIdentity,
                    externalSystemConfigurationId:
                        externalSystemConfigurationId,
                },
                include: {
                    user: true,
                },
            })
        } catch (e) {
            //TODO: add logging instead
            //throw new Error(e.message)
        }
        return null
    }

    async findByUserAndDataAdapter(
        userId: string,
        externalSystemConfigurationId: string
    ): Promise<ExternalIdentityDto | null> {
        try {
            const result = await this.prisma.externalIdentity.findFirst({
                where: {
                    userId: userId,
                    externalSystemConfigurationId:
                        externalSystemConfigurationId,
                },
            })
            if (!result) return null

            return new ExternalIdentityDto(result)
        } catch (e) {
            //TODO: add logging instead
            //throw new Error(e.message)
        }
        return null
    }

    async findAll(
        externalIdentities: string[],
        externalSystemConfigurationId: string
    ): Promise<ExternalIdentity[]> {
        const identities: ExternalIdentity[] = []
        try {
            externalIdentities.forEach(async (externalIdentity) => {
                const identity = await this.prisma.externalIdentity.findFirst({
                    where: {
                        externalId: externalIdentity,
                        externalSystemConfigurationId:
                            externalSystemConfigurationId,
                    },
                })
                if (identity != null) {
                    identities[identity.externalId] = identity
                }
            })
        } catch (e) {
            //TODO: add logging instead
            //throw new Error(e.message)
        }
        return identities
    }

    async findManyByConfigurationId(
        configurationId: string,
        includeSubscriptions: boolean = false,
        includeToken: boolean = false
    ): Promise<ExternalIdentityDto[]> {
        const identityDtos: ExternalIdentityDto[] = []
        try {
            const identities = await this.prisma.externalIdentity.findMany({
                where: {
                    externalSystemConfigurationId: configurationId,
                },
                include: {
                    subscriptions: includeSubscriptions,
                    token: includeToken,
                },
            })

            identities.forEach((identity) => {
                identityDtos.push(
                    new ExternalIdentityDto(
                        identity,
                        identity.subscriptions,
                        identity.token
                    )
                )
            })
        } catch (e) {
            //TODO: add logging instead
            //throw new Error(e.message)
        }
        return identityDtos
    }
}
