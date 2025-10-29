import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalIdentityHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getIdentities(
        externalSystemName: string,
        externalSystemConfigurationId: string
    ): Promise<string[] | null> {
        return await this.getEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`
        )
    }

    public async addIdentity(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<boolean> {
        const identities = await this.getIdentities(
            externalSystemName,
            externalSystemConfigurationId
        )
        if (identities && identities.includes(externalIdentityId)) return true
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            externalIdentityId
        )
    }

    public async addIdentities(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityIds: string[]
    ): Promise<boolean> {
        return await this.addEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            externalIdentityIds
        )
    }

    public async removeIdentity(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<boolean> {
        return await this.removeEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            externalIdentityId
        )
    }

    public async removeIdentities(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityIds: string[]
    ): Promise<boolean> {
        return await this.removeEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            externalIdentityIds
        )
    }

    public async deleteIdentities(
        externalSystemName: string,
        externalSystemConfigurationId: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:externalIdentities`
    }
}
