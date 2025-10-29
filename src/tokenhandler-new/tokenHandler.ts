import { ExternalIdentityTokenDto } from 'src/externalidentitytoken/externalidentitytoken.dto'
import { KeyHandler } from '../keyhandler/keyhandler'
import { ExternalSystemConfigurationDto } from 'src/externalsystemconfiguration/externalsystemconfiguration.dto'
import { ExternalIdentityTokenUpdateDto } from 'src/externalidentitytoken/externalidentitytoken.update.dto'
import { ExternalIdentityTokenHandler } from './externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from './externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from './externalidentitytokenhandler.refreshexpirydate'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { Logger } from '@nestjs/common'

export abstract class TokenHandler {
    constructor(
        private readonly keyHandler: KeyHandler,
        private readonly configurationHostHandler: ExternalSystemConfigurationHostHandler,
        private readonly tokenHandler: ExternalIdentityTokenHandler,
        private readonly tokenExpiryHandler: ExternalIdentityTokenExpiryHandler,
        private readonly tokenRefreshExpiryHandler: ExternalIdentityTokenRefreshExpiryHandler,
        protected readonly externalSystemName: string
    ) {}

    protected async init(
        configurations: ExternalSystemConfigurationDto[]
    ): Promise<boolean> {
        for (const configuration of configurations) {
            if (!configuration.externalIdentities) continue

            await this.configurationHostHandler.addConfigurationHost(
                this.externalSystemName,
                configuration.id,
                configuration.domain
            )

            for (const identity of configuration.externalIdentities) {
                const token = await this.getToken(identity.id, configuration.id)
                if (!token) continue
                Logger.log('Token retrieved!')

                const expiryDate =
                    await this.tokenExpiryHandler.getTokenExpiryDate(
                        this.externalSystemName,
                        configuration.id,
                        identity.id
                    )

                if (this.isTokenExpired(expiryDate)) {
                    Logger.log('Refreshing token...')
                    await this.refreshToken(identity.id, configuration.id)
                }
            }
        }
        return true
    }

    public async getToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string
    ): Promise<string | null> {
        try {
            let token = await this.tokenHandler.getToken(
                this.externalSystemName,
                externalSystemConfigurationId,
                externalIdentityId
            )

            if (!token) {
                Logger.log('Retrieving token from database...')
                const remoteToken =
                    await this.getRemoteToken(externalIdentityId)
                if (!remoteToken) return null
                else if (
                    remoteToken &&
                    this.isRefreshTokenExpired(remoteToken.refreshExpiryDate)
                ) {
                    await this.deleteRemoteToken(externalIdentityId)
                    return null
                }

                Logger.log('Inserting token into in-memory database...')
                token = await this.tokenHandler.addToken(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    externalIdentityId,
                    remoteToken.token
                )

                if (remoteToken.expiryDate)
                    await this.tokenExpiryHandler.addTokenExpiryDate(
                        this.externalSystemName,
                        remoteToken.externalSystemConfigurationId,
                        remoteToken.externalIdentityId,
                        remoteToken.expiryDate
                    )

                if (remoteToken.refreshExpiryDate)
                    await this.tokenRefreshExpiryHandler.addTokenRefreshExpiryDate(
                        this.externalSystemName,
                        remoteToken.externalSystemConfigurationId,
                        remoteToken.externalIdentityId,
                        remoteToken.refreshExpiryDate
                    )
            }
            if (!token) return null

            return this.keyHandler.decryptValue(
                externalSystemConfigurationId,
                token
            )
        } catch (e) {
            Logger.error(
                `Error retrieving token for external identity with id ${externalIdentityId}: ${e.message}`
            )
        }
        return null
    }

    public async setToken(
        token: ExternalIdentityTokenUpdateDto
    ): Promise<string | null> {
        try {
            const localToken = await this.tokenHandler.addToken(
                this.externalSystemName,
                token.externalSystemConfigurationId,
                token.externalIdentityId,
                token.token,
                true
            )
            if (!localToken) return null

            if (
                token.expiryDate &&
                !(await this.tokenExpiryHandler.addTokenExpiryDate(
                    this.externalSystemName,
                    token.externalSystemConfigurationId,
                    token.externalIdentityId,
                    token.expiryDate
                ))
            )
                return null

            if (
                token.refreshExpiryDate &&
                !(await this.tokenRefreshExpiryHandler.addTokenRefreshExpiryDate(
                    this.externalSystemName,
                    token.externalSystemConfigurationId,
                    token.externalIdentityId,
                    token.refreshExpiryDate
                ))
            )
                return null

            const remoteToken = await this.updateRemoteToken(
                token.externalIdentityId,
                token.externalSystemConfigurationId,
                localToken,
                token.expiryDate,
                token.refreshExpiryDate
            )
            if (!remoteToken) return null
            return localToken
        } catch (e) {
            Logger.error(
                `Error setting token for external identity with id ${token.externalIdentityId}: ${e.message}`
            )
        }
        return null
    }

    public async deleteToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string
    ): Promise<boolean> {
        try {
            const deletedToken = await this.tokenHandler.deleteToken(
                this.externalSystemName,
                externalSystemConfigurationId,
                externalIdentityId
            )
            const deletedExpiry =
                await this.tokenExpiryHandler.deleteTokenExpiryDate(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    externalIdentityId
                )
            const deletedRefreshExpiry =
                await this.tokenRefreshExpiryHandler.deleteTokenRefreshExpiryDate(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    externalIdentityId
                )
            if (!deletedToken || !deletedExpiry || !deletedRefreshExpiry)
                return false

            return await this.deleteRemoteToken(externalIdentityId)
        } catch (e) {
            Logger.log(
                `Error deleting token for external identity with id ${externalIdentityId}: ${e.message}`
            )
        }
        return false
    }

    protected async refreshToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string
    ): Promise<string | null> {
        const token = await this.getToken(
            externalIdentityId,
            externalSystemConfigurationId
        )
        if (!token) {
            Logger.warn(
                `No token found for external identity with id ${externalIdentityId}. Cannot refresh token.`
            )
            return null
        }

        const refreshExpiryDate =
            await this.tokenRefreshExpiryHandler.getTokenRefreshExpiryDate(
                this.externalSystemName,
                externalSystemConfigurationId,
                externalIdentityId
            )
        if (this.isRefreshTokenExpired(refreshExpiryDate)) {
            await this.deleteToken(
                externalIdentityId,
                externalSystemConfigurationId
            )
            return null
        }

        Logger.log(
            `Refreshing token for external identity with id ${externalIdentityId}...`
        )
        const refreshedToken = await this.requestTokenRefresh(
            externalIdentityId,
            externalSystemConfigurationId,
            token
        )
        Logger.log(refreshedToken)
        if (!refreshedToken) {
            Logger.log(
                `Token for external identity with id ${externalIdentityId} could not be refreshed. Deleting token from database...`
            )
            await this.deleteToken(
                externalIdentityId,
                externalSystemConfigurationId
            )
            return null
        }

        Logger.log(
            `Re-encrypting token for external identity with id ${externalIdentityId}...`
        )
        return await this.setToken(refreshedToken)
    }

    protected abstract isRefreshTokenExpired(
        refreshExpiryDate: Date | null
    ): boolean

    protected abstract isTokenExpired(expiryDate: Date | null): boolean

    protected abstract requestTokenRefresh(
        externalIdentityId: string,
        externalSystemConfigurationId: string,
        token: string
    ): Promise<ExternalIdentityTokenDto | null>

    protected abstract createRemoteToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string,
        token: string,
        expiryDate: Date | null,
        refreshExpiryDate: Date | null
    ): Promise<ExternalIdentityTokenDto | null>

    protected abstract updateRemoteToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string,
        token: string,
        expiryDate: Date | null,
        refreshExpiryDate: Date | null
    ): Promise<ExternalIdentityTokenDto | null>

    protected abstract deleteRemoteToken(
        externalIdentityId: string
    ): Promise<boolean>

    protected abstract getRemoteToken(
        externalIdentityId: string
    ): Promise<ExternalIdentityTokenDto | null>
}
