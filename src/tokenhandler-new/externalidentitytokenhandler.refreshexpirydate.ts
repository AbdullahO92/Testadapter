import { EntityHandler } from 'src/entityhandler/entityhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalIdentityTokenRefreshExpiryHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getTokenRefreshExpiryDate(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<Date | null> {
        const result = await this.getEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
        if (!result) return null
        return new Date(result)
    }

    public async addTokenRefreshExpiryDate(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        refreshExpiryDate: Date
    ): Promise<boolean> {
        await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            refreshExpiryDate.toISOString()
        )
    }

    public async deleteTokenRefreshExpiryDate(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:tokenRefreshExpiryDate`
    }
}
