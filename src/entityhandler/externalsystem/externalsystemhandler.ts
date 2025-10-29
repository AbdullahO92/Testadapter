import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalSystemHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getExternalSystem(
        externalSystemName: string
    ): Promise<string | null> {
        return await this.getEntity(externalSystemName)
    }

    public async addExternalSystem(
        externalSystemName: string,
        externalSystemId: string
    ): Promise<boolean> {
        if (await this.getExternalSystem(externalSystemName)) return true
        return await this.addEntity(externalSystemName, externalSystemId)
    }

    public async deleteExternalSystem(
        externalSystemName: string
    ): Promise<boolean> {
        return await this.deleteEntities(externalSystemName)
    }

    protected getEntryName(key: string): string {
        return `${key}:externalSystem`
    }
}
