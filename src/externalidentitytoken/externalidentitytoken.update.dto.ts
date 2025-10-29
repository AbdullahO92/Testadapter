import { ExternalIdentityToken } from '@prisma/client'

export class ExternalIdentityTokenUpdateDto {
    public readonly id: string
    public readonly externalIdentityId: string
    public readonly externalSystemConfigurationId: string
    public readonly token: string
    public readonly generatedDate: Date
    public readonly updatedDate: Date
    public readonly expiryDate: Date | null
    public readonly refreshExpiryDate: Date | null

    constructor(
        identityId: string,
        configurationId: string,
        token: string,
        expiryDate: Date | null = null,
        refreshExpiryDate: Date | null = null
    ) {
        this.externalIdentityId = identityId
        this.externalSystemConfigurationId = configurationId
        this.token = token
        this.expiryDate = expiryDate
        this.refreshExpiryDate = refreshExpiryDate
    }
}
