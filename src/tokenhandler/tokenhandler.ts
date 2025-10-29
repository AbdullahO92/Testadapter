import { ExternalIdentityTokenDto } from 'src/externalidentitytoken/externalidentitytoken.dto'
import { KeyHandler } from '../keyhandler/keyhandler'
import { ExternalSystemConfigurationDto } from 'src/externalsystemconfiguration/externalsystemconfiguration.dto'
import { ExternalIdentityTokenUpdateDto } from 'src/externalidentitytoken/externalidentitytoken.update.dto'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { ExternalIdentityTokenHandler } from 'src/tokenhandler-new/externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.refreshexpirydate'
import { ExternalSystemConfigurationHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalIdentityHandler } from 'src/entityhandler/externalidentity/externalidentityhandler'
import { Logger } from '@nestjs/common'

export abstract class TokenHandler {
    constructor(
        private readonly keyHandler: KeyHandler,
        private readonly configurationHostHandler: ExternalSystemConfigurationHostHandler,
        private readonly tokenHandler: ExternalIdentityTokenHandler,
        private readonly tokenExpiryHandler: ExternalIdentityTokenExpiryHandler,
        private readonly tokenRefreshExpiryHandler: ExternalIdentityTokenRefreshExpiryHandler,
        private readonly configurationService: ExternalSystemConfigurationHandler,
        private readonly identityService: ExternalIdentityHandler,
        protected readonly externalSystemName: string,
    ) {}

    protected async init(
        configurations: ExternalSystemConfigurationDto[]
    ): Promise<boolean> {
        await this.keyHandler.init(
            configurations.map((configuration) => configuration.id)
        )
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
                console.log('Token retrieved!')

                const expiryDate =
                    await this.tokenExpiryHandler.getTokenExpiryDate(
                        this.externalSystemName,
                        configuration.id,
                        identity.id
                    )
                if (this.isTokenExpired(expiryDate)) {
                    console.log('Refreshing token...')
                    await this.refreshToken(identity.id, configuration.id)
                }
            }
        }
        console.log('Returning from function.')
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
                console.log('Retrieving token from database...')
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

                console.log('Inserting token into in-memory database...')
                token = await this.tokenHandler.addToken(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    externalIdentityId,
                    remoteToken.token
                )

                if (remoteToken.expiryDate)
                    await this.tokenExpiryHandler.addTokenExpiryDate(
                        this.externalSystemName,
                        externalSystemConfigurationId,
                        remoteToken.externalIdentityId,
                        remoteToken.expiryDate
                    )

                if (remoteToken.refreshExpiryDate)
                    await this.tokenRefreshExpiryHandler.addTokenRefreshExpiryDate(
                        this.externalSystemName,
                        externalSystemConfigurationId,
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
            console.log('Updating local token...')
            const localToken = await this.tokenHandler.addToken(
                this.externalSystemName,
                token.externalSystemConfigurationId,
                token.externalIdentityId,
                token.token,
                true
            )
            if (!localToken) return null

            console.log('Updating local token expiry date...')
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

            console.log('Updating local token refresh expiry date...')
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

            console.log('Updating remote token...')
            const remoteToken = await this.updateRemoteToken(
                token.externalIdentityId,
                localToken,
                token.expiryDate,
                token.refreshExpiryDate
            )
            if (!remoteToken) return null
            console.log('Setting token successfull!')
            return localToken
        } catch (e) {
            Logger.error(`Error setting token: ${e.message}`)
        }
        return null
    }

    public async deleteToken(
        externalIdentityId: string,
        externalSystemConfigurationId: string
    ): Promise<boolean> {
        try {
            let result = await this.tokenHandler.deleteToken(
                this.externalSystemName,
                externalSystemConfigurationId,
                externalIdentityId
            )
            if (!result) return false

            result = await this.tokenExpiryHandler.deleteTokenExpiryDate(
                this.externalSystemName,
                externalSystemConfigurationId,
                externalIdentityId
            )
            if (!result) return false

            result =
                await this.tokenRefreshExpiryHandler.deleteTokenRefreshExpiryDate(
                    this.externalSystemName,
                    externalSystemConfigurationId,
                    externalIdentityId
                )
            if (!result) return false

            return await this.deleteRemoteToken(externalIdentityId)
        } catch (e) {
            Logger.error(
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
        if (!token) return null

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

        console.log(
            `Refreshing token for external identity with id ${externalIdentityId}...`
        )
        const refreshedToken = await this.requestTokenRefresh(
            externalIdentityId,
            externalSystemConfigurationId,
            token
        )
        if (!refreshedToken) {
            console.log(
                `Token for external identity with id ${externalIdentityId} could not be refreshed. Deleting token fromd database...`
            )
            await this.deleteToken(
                externalIdentityId,
                externalSystemConfigurationId
            )
            return null
        }

        console.log(
            `Re-encrypting token for external identity with id ${externalIdentityId}...`
        )
        return await this.setToken(refreshedToken)
    }

        protected async refreshTokens() {
        const configurations = await this.configurationService.getConfigurations(this.externalSystemName);
        if (!configurations) return;

        for (const configuration of configurations) {
            const identities = await this.identityService.getIdentities(
                this.externalSystemName,
                configuration
            );
            if (!identities) continue;

            for (const identity of identities) {
                await this.refreshToken(
                    identity,
                    configuration
                );
            }
        }
        console.log('All tokens refreshed successfully.', this.externalSystemName);
    }

    protected async getConfigurationHost(
        externalSystemConfigurationId: string
    ): Promise<string | null> {
        return await this.configurationHostHandler.getConfigurationHost(
            this.externalSystemName,
            externalSystemConfigurationId
        )
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
        token: string,
        expiryDate: Date | null,
        refreshExpiryDate: Date | null
    ): Promise<ExternalIdentityTokenDto | null>

    protected abstract updateRemoteToken(
        externalIdentityId: string,
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
