import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalSystemConfigurationHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getConfigurations(
        externalSystemName: string
    ): Promise<string[] | null> {
        return await this.getEntities(externalSystemName)
    }

    public async addConfiguration(
        externalSystemName: string,
        externalSystemConfigurationId: string
    ): Promise<boolean> {
        const configurations = await this.getConfigurations(externalSystemName)
        if (
            configurations &&
            configurations.includes(externalSystemConfigurationId)
        )
            return true

        return await this.addEntity(
            externalSystemName,
            externalSystemConfigurationId
        )
    }

    public async addConfigurations(
        externalSystemName: string,
        externalSystemConfigurationIds: string[]
    ): Promise<boolean> {
        return await this.addEntities(
            externalSystemName,
            externalSystemConfigurationIds
        )
    }

    public async removeConfiguration(
        externalSystemName: string,
        externalSystemConfigurationId: string
    ): Promise<boolean> {
        return await this.removeEntity(
            externalSystemName,
            externalSystemConfigurationId
        )
    }

    public async removeConfigurations(
        externalSystemName: string,
        externalSystemConfigurationIds: string[]
    ): Promise<boolean> {
        return await this.removeEntities(
            externalSystemName,
            externalSystemConfigurationIds
        )
    }

    public async deleteConfigurations(
        externalSystemName: string
    ): Promise<boolean> {
        return await this.deleteEntities(externalSystemName)
    }

    protected getEntryName(key: string): string {
        return `${key}:configurations`
    }
}
