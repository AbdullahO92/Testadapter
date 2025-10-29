import { ExternalSystemConfigurationDto } from 'src/externalsystemconfiguration/externalsystemconfiguration.dto'
import { ExternalIdentityTokenDto } from 'src/externalidentitytoken/externalidentitytoken.dto'
import { TokenHandler } from '../tokenhandler'
import { KeyHandler } from '../../keyhandler/keyhandler'
import { ExternalIdentityTokenUpdateDto } from 'src/externalidentitytoken/externalidentitytoken.update.dto'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { ExternalIdentityTokenRepository } from 'src/externalidentitytoken/externalidentitytoken.repository'
import { ConfigService } from '@nestjs/config'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { ExternalIdentityTokenHandler } from 'src/tokenhandler-new/externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.refreshexpirydate'
import { Injectable, Logger } from '@nestjs/common'
import { ExternalSystemConfigurationHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalIdentityHandler } from 'src/entityhandler/externalidentity/externalidentityhandler'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class CanvasTokenHandler extends TokenHandler {
    protected refreshIntervalMinuteCount: number = 30

    private clientId: string
    private clientSecret: string
    private apiVersion: string
    private hostName: string

    constructor(
        keyHandler: KeyHandler,
        configurationHostHandler: ExternalSystemConfigurationHostHandler,
        tokenHandler: ExternalIdentityTokenHandler,
        tokenExpiryHandler: ExternalIdentityTokenExpiryHandler,
        tokenRefreshExpiryHandler: ExternalIdentityTokenRefreshExpiryHandler,
        configurationService: ExternalSystemConfigurationHandler,
        identityService: ExternalIdentityHandler,
        private readonly configService: ConfigService,
        private readonly identityRepository: ExternalIdentityRepository,
        private readonly tokenRepository: ExternalIdentityTokenRepository,
    ) {
        super(
            keyHandler,
            configurationHostHandler,
            tokenHandler,
            tokenExpiryHandler,
            tokenRefreshExpiryHandler,
            configurationService,
            identityService,
            'canvas'
        )

        this.clientId = this.configService.get<string>('CANVAS_CLIENT_ID')
        this.clientSecret = this.configService.get<string>(
            'CANVAS_CLIENT_SECRET'
        )
        this.apiVersion = this.configService.get<string>('CANVAS_API_VERSION')
        this.hostName = this.configService.get<string>('API_HOST')

        if (!this.clientId || !this.clientSecret) {
            throw new Error('No Canvas installation was defined.')
        }
    }

    public async init(
        configurations: ExternalSystemConfigurationDto[]
    ): Promise<boolean> {
        return await super.init(configurations)
    }

    protected async requestTokenRefresh(
        externalIdentityId: string,
        externalSystemConfigurationId: string,
        token: string
    ): Promise<ExternalIdentityTokenDto | null> {
        const hostName = await this.getConfigurationHost(
            externalSystemConfigurationId
        )
        if (!hostName) return null

        const parsedToken = JSON.parse(token)
        const refreshToken = parsedToken['refresh_token']
        if (!refreshToken) return null

        const refreshedToken = await this.fetchRefreshedToken(
            hostName,
            refreshToken
        )
        if (!refreshedToken) return null
        refreshedToken['refresh_token'] = refreshToken

        const expiryDate = new Date(Date.now())
        expiryDate.setSeconds(
            expiryDate.getSeconds() + refreshedToken['expires_in']
        )
        Logger.log(`New expiry date: ${expiryDate}`)

        return new ExternalIdentityTokenUpdateDto(
            externalIdentityId,
            externalSystemConfigurationId,
            JSON.stringify(refreshedToken),
            expiryDate
        )
    }

    protected async createRemoteToken(
        externalIdentityId: string,
        token: string,
        expiryDate: Date | null,
        refreshExpiryDate: Date | null
    ): Promise<ExternalIdentityTokenDto | null> {
        return await this.tokenRepository.create(
            externalIdentityId,
            token,
            expiryDate,
            refreshExpiryDate
        )
    }

    protected async updateRemoteToken(
        externalIdentityId: string,
        token: string,
        expiryDate: Date | null,
        refreshExpiryDate: Date | null
    ): Promise<ExternalIdentityTokenDto | null> {
        return await this.tokenRepository.update(
            externalIdentityId,
            token,
            expiryDate,
            refreshExpiryDate
        )
    }

    protected async deleteRemoteToken(
        externalIdentityId: string
    ): Promise<boolean> {
        await this.identityRepository.updateEnabledStatus(
            externalIdentityId,
            false
        )

        return await this.tokenRepository.delete(externalIdentityId)
    }

    protected async getRemoteToken(
        externalIdentityId: string
    ): Promise<ExternalIdentityTokenDto | null> {
        return await this.tokenRepository.findByIdentityId(externalIdentityId)
    }

    @Cron('*/50 * * * *')
    protected async refreshTokens() {
        // Refresh tokens for all external identities
        await super.refreshTokens()
    }

    protected isRefreshTokenExpired(refreshExpiryDate: Date | null): boolean {
        if (!refreshExpiryDate) return false
        return refreshExpiryDate.getTime() > Date.now()
    }

    protected isTokenExpired(expiryDate: Date | null): boolean {
        if (!expiryDate) return false
        let currentDate = new Date(Date.now())
        currentDate = new Date(
            currentDate.setMinutes(
                currentDate.getMinutes() + this.refreshIntervalMinuteCount
            )
        )
        return expiryDate <= currentDate
    }

    private async fetchRefreshedToken(
        domainName: string,
        refreshToken: string
    ): Promise<any | null> {
        const response = await fetch(
            `${domainName}/login/oauth2/token?` +
                `grant_type=refresh_token&` +
                `client_id=${this.clientId}&` +
                `client_secret=${this.clientSecret}&` +
                `redirect_uri=${this.hostName}/${this.apiVersion}/api/canvas/auth&` +
                `refresh_token=${refreshToken}`,
            {
                method: 'POST',
            }
        )
        if (!response.ok) {
            Logger.log(
                `Request did not finish successfully: ${response.status}`
            )
            return null
        }
        return await response.json()
    }

    public async fetchAuthorizationToken(
        code: string,
        domain: string
    ): Promise<any | null> {
        // in case of invalid url, check domain in db, should contain https://*CANVAS_URL*
        const response = await fetch(
            `${domain}/login/oauth2/token?` +
                `code=${code}&` +
                `grant_type=authorization_code&` +
                `client_id=${this.clientId}&` +
                `client_secret=${this.clientSecret}&` +
                `redirect_uri=${this.hostName}/${this.apiVersion}/api/canvas/auth`,
            {
                method: 'POST',
            }
        )
        if (!response.ok) return null
        return await response.json()
    }
}
