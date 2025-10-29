import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as jwksRsa from 'jwks-rsa'
import { Logger } from '@nestjs/common'

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'AzureAD') {
    private readonly logger = new Logger(AzureADStrategy.name)
    constructor(audience: string, tenantId: string) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: audience,
            issuer: `https://sts.windows.net/${tenantId}/`,
            algorithms: ['RS256'],
            ignoreExpiration: false,
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
            }),
        })
        this.logger.log(`Audience: ${audience}`)
        this.logger.log(`TenantId: ${tenantId}`)
        this.logger.log(`AzureADStrategy initialized`)
    }

    validate(payload: any) {
        return payload
    }
}
