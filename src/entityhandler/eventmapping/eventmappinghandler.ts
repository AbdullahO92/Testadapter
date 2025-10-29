import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EventMappingHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getMapping(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalSystemResponseId: string
    ): Promise<string | null> {
        const result = await this.getEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:responses:${externalSystemResponseId}`
        )
        if (!result || result?.length == null) return null
        return result[0]
    }

    public async addMapping(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalSystemResponseId: string,
        eventMappingId: string
    ): Promise<boolean> {
        if (
            await this.getMapping(
                externalSystemName,
                externalSystemConfigurationId,
                externalSystemResponseId
            )
        )
            return true
        return await this.addEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:responses:${externalSystemResponseId}`,
            eventMappingId
        )
    }

    public async removeMapping(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalSystemResponseId: string,
        eventMappingId: string
    ): Promise<boolean> {
        return await this.removeEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:responses:${externalSystemResponseId}`,
            eventMappingId
        )
    }

    public async deleteMappings(
        externalSystemConfigurationId: string,
        externalSystemResponseIds: string[]
    ): Promise<boolean> {
        for (const responseId in externalSystemResponseIds) {
            return await this.deleteEntities(
                `${externalSystemConfigurationId}:${responseId}`
            )
        }
    }

    protected getEntryName(key: string): string {
        return `${key}:eventMappings`
    }
}
