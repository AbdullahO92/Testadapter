import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalSystemConfigurationHostHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getConfigurationHost(
        externalSystemName: string,
        externalSystemConfigurationId: string
    ): Promise<string | null> {
        return await this.getEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`
        )
    }

    public async addConfigurationHost(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        hostName: string
    ): Promise<boolean> {
        if (
            await this.getConfigurationHost(
                externalSystemName,
                externalSystemConfigurationId
            )
        )
            return true
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            hostName
        )
    }

    public async removeConfigurationHost(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        hostName: string
    ): Promise<boolean> {
        return await this.removeEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}`,
            hostName
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:host`
    }
}
