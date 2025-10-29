import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExternalIdentityTokenDto } from './externalidentitytoken.dto'

@Injectable()
export class ExternalIdentityTokenRepository {
    constructor(private prisma: PrismaService) {}

    async getAll(): Promise<ExternalIdentityTokenDto[]> {
        const tokenDtos: ExternalIdentityTokenDto[] = []
        try {
            const tokens = await this.prisma.externalIdentityToken.findMany()
            tokens.forEach((token) => {
                tokenDtos.push(new ExternalIdentityTokenDto(token))
            })
        } catch (e) {
            Logger.error(
                `Error fetching all external identity tokens: ${e.message}`
            )
        }
        return tokenDtos
    }

    async findManyByConfigurationIds(configurationIds: string[]) {
        const tokenDtos: ExternalIdentityTokenDto[] = []
        try {
            const tokens = await this.prisma.externalIdentityToken.findMany({
                where: {
                    externalIdentityId: {
                        in: configurationIds,
                    },
                },
            })
            tokens.forEach((token) => {
                tokenDtos.push(new ExternalIdentityTokenDto(token))
            })
        } catch (e) {
            Logger.error(
                `Error fetching external identity tokens for configuration IDs: ${e.message}`
            )
        }
        return tokenDtos
    }

    async findByIdentityId(
        identityId: string
    ): Promise<ExternalIdentityTokenDto | null> {
        try {
            const result = await this.prisma.externalIdentityToken.findFirst({
                where: {
                    externalIdentityId: identityId,
                },
            })
            if (result == null) return null

            return new ExternalIdentityTokenDto(result)
        } catch (e) {
            Logger.error(
                `Error finding token for external identity ${identityId}: ${e.message}`
            )
        }
        return null
    }

    async create(
        identityId: string,
        //configurationId: string,
        token: string,
        expiryDate: Date | null = null,
        refreshExpiryDate: Date | null = null
    ): Promise<ExternalIdentityTokenDto | null> {
        try {
            const existingToken = await this.findByIdentityId(identityId)
            if (existingToken != null) return existingToken

            const result = await this.prisma.externalIdentityToken.create({
                data: {
                    externalIdentityId: identityId,
                    //dataAdapterId: configurationId,
                    token: token,
                    expiryDate: expiryDate,
                    refreshExpiryDate: refreshExpiryDate,
                },
            })
            if (result == null) return null

            return new ExternalIdentityTokenDto(result)
        } catch (e) {
            Logger.error(
                `Error creating token for external identity ${identityId}: ${e.message}`
            )
        }
        return null
    }

    async update(
        identityId: string,
        //configurationId: string,
        token: string,
        expiryDate: Date | null = null,
        refreshExpiryDate: Date | null = null
    ): Promise<ExternalIdentityTokenDto | null> {
        try {
            const existingToken = await this.findByIdentityId(identityId)
            if (!existingToken)
                return await this.create(
                    identityId,
                    //configurationId,
                    token,
                    expiryDate,
                    refreshExpiryDate
                )

            const result = await this.prisma.externalIdentityToken.update({
                where: {
                    externalIdentityId: identityId,
                },
                data: {
                    token: token,
                    expiryDate: expiryDate,
                    refreshExpiryDate: refreshExpiryDate,
                },
            })
            if (result == null) return null

            return new ExternalIdentityTokenDto(result)
        } catch (e) {
            Logger.error(
                `Error updating token for external identity ${identityId}: ${e.message}`
            )
        }
        return null
    }

    async delete(identityId: string): Promise<boolean> {
        try {
            await this.prisma.externalIdentityToken.delete({
                where: {
                    externalIdentityId: identityId,
                },
            })
            return true
        } catch (e) {
            Logger.error(
                `Error deleting token for external identity ${identityId}: ${e.message}`
            )
        }
        return false
    }
}
