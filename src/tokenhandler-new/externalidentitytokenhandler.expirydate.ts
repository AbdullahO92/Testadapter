import { EntityHandler } from 'src/entityhandler/entityhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalIdentityTokenExpiryHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getTokenExpiryDate(
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

    public async addTokenExpiryDate(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        expiryDate: Date
    ): Promise<boolean> {
        await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
            expiryDate.toISOString()
        )
    }

    public async deleteTokenExpiryDate(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:tokenExpiryDate`
    }
}
