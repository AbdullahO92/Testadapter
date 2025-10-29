import { ExternalIdentityToken } from '@prisma/client'

export class ExternalIdentityTokenDto {
    public id: string | null
    public externalIdentityId: string
    public externalSystemConfigurationId: string
    public token: string
    public generatedDate: Date | null
    public updatedDate: Date | null
    public expiryDate: Date | null
    public refreshExpiryDate: Date | null

    constructor(token: ExternalIdentityToken) {
        this.id = token.id
        this.externalIdentityId = token.externalIdentityId
        //this.externalSystemConfigurationId = token.dataAdapterId;
        this.token = token.token
        this.generatedDate = token.generatedDate
        this.updatedDate = token.updatedDate
        this.expiryDate = token.expiryDate
        this.refreshExpiryDate = token.refreshExpiryDate
    }
}
