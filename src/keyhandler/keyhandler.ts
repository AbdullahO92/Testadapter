import { Logger } from '@nestjs/common'
import { StorageHandler } from '../storagehandler/storagehandler'
import * as crypto from 'crypto'

export abstract class KeyHandler {
    constructor(protected readonly storageHandler: StorageHandler) {}

    public async encryptValue(
        keyName: string,
        value: string
    ): Promise<string | null> {
        const key = await this.getKey(keyName)
        if (!key) return null

        return this.encrypt(
            crypto.createSecretKey(Buffer.from(key, 'hex')),
            Buffer.from(keyName.replace('-', '').slice(0, 24), 'hex'),
            value
        )
    }

    public async decryptValue(
        keyName: string,
        value: string
    ): Promise<string | null> {
        const key = await this.getKey(keyName)
        if (!key) return null

        return this.decrypt(
            crypto.createSecretKey(Buffer.from(key, 'hex')),
            Buffer.from(keyName.replace('-', '').slice(0, 24), 'hex'),
            value
        )
    }

    protected async getLocalKey(keyName: string): Promise<string | null> {
        Logger.log(`Searching for locally stored key with id ${keyName}...`)
        return await this.storageHandler.get(`key:${keyName}`)
    }

    protected async setLocalKey(
        keyName: string,
        keyValue: string
    ): Promise<string | null> {
        // Get key from in-memory database
        Logger.log(`Setting locally stored key with id ${keyName}...`)
        return await this.storageHandler.set(`key:${keyName}`, keyValue, 900)
    }

    protected async deleteKey(keyName: string): Promise<boolean> {
        Logger.log(`Searching for locally stored key with id ${keyName}...`)
        return await this.storageHandler.delete(`key:${keyName}`)
    }

    protected abstract getKey(keyName: string): Promise<string | null>

    protected abstract setKey(keyName: string): Promise<string | null>

    protected abstract encrypt(
        key: crypto.KeyObject,
        iv: Buffer<ArrayBufferLike>,
        value: string
    ): Promise<string | null>

    protected abstract decrypt(
        key: crypto.KeyObject,
        iv: Buffer<ArrayBufferLike>,
        value: string
    ): Promise<string | null>

    public abstract init(keyNames: string[]): Promise<void>
}
