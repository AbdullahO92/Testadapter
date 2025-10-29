import { Injectable } from '@nestjs/common'
import { StorageHandler } from '../storagehandler/storagehandler'
import * as crypto from 'crypto'
import { EntityHandler } from 'src/entityhandler/entityhandler'

@Injectable()
export class StateHandler extends EntityHandler {
    constructor(storageHandler: StorageHandler) {
        super(storageHandler)
    }

    public async addState(
        externalIdentityId: string,
        eventMappingId: string,
        notification: string
    ): Promise<boolean> {
        const newNotificationHash = crypto
            .createHash('sha512')
            .update(notification)
            .digest('hex')
        return await this.updateEntity(
            `${externalIdentityId}:${eventMappingId}`,
            newNotificationHash
        )
    }

    public async deleteState(
        externalIdentityId: string,
        eventMappingId: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalIdentityId}:${eventMappingId}`
        )
    }

    public async isNewNotification(
        externalIdentityId: string,
        eventMappingId: string,
        notification: string
    ): Promise<boolean> {
        const notificationHash = crypto
            .createHash('sha512')
            .update(notification)
            .digest('hex')

        const storedState = await this.getEntity(
            `${externalIdentityId}:${eventMappingId}`
        )
        if (!storedState || storedState == '') {
            await this.addEntity(
                `${externalIdentityId}:${eventMappingId}`,
                notificationHash
            )
            return true
        }
        return notificationHash != storedState
    }

    protected getEntryName(key: string): string {
        return `state:${key}`
    }
}
