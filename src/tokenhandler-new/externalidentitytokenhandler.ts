import { EntityHandler } from 'src/entityhandler/entityhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { Injectable } from '@nestjs/common'
import { KeyHandler } from 'src/keyhandler/keyhandler'

@Injectable()
export class ExternalIdentityTokenHandler extends EntityHandler {
    constructor(
        storageHandler: StorageHandler,
        private readonly keyHandler: KeyHandler
    ) {
        super(storageHandler)
    }

    public async getToken(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<string | null> {
        return await this.getEntity(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
    }

    public async addToken(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string,
        token: string,
        encryptToken: boolean = false
    ): Promise<string | null> {
        const encryptedToken = encryptToken
            ? await this.keyHandler.encryptValue(
                  externalSystemConfigurationId,
                  token
              )
            : token
        if (!encryptedToken) return null

        await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
        if (
            await this.addEntity(
                `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`,
                encryptedToken
            )
        )
            return await this.getEntity(
                `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
            )
        return null
    }

    public async deleteToken(
        externalSystemName: string,
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<boolean> {
        return await this.deleteEntities(
            `${externalSystemName}:configurations:${externalSystemConfigurationId}:externalIdentities:${externalIdentityId}`
        )
    }

    protected getEntryName(key: string): string {
        return `${key}:token`
    }
}
