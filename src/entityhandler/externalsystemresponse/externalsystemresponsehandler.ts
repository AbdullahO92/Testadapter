import { EntityHandler } from '../entityhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalSystemResponseHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async getResponse(
        externalSystemName: string,
        externalSystemResponseName: string
    ): Promise<string | null> {
        const result = await this.getEntities(
            `${externalSystemName}:responses:${externalSystemResponseName}`
        )
        if (!result || result?.length == null) return null
        return result[0]
    }

    public async addResponse(
        externalSystemName: string,
        externalSystemResponseName: string,
        externalSystemResponseId: string
    ): Promise<boolean> {
        if (
            await this.getResponse(
                externalSystemName,
                externalSystemResponseName
            )
        )
            return true
        return await this.addEntity(
            `${externalSystemName}:responses:${externalSystemResponseName}`,
            externalSystemResponseId
        )
    }

    public async deleteResponse(
        externalSystemName: string,
        externalSystemResponseName: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalSystemName}:responses:${externalSystemResponseName}`
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:responseId`
    }
}
