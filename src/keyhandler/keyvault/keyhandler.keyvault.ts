import { ConfigService } from '@nestjs/config'
import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import * as crypto from 'crypto'
import { KeyHandler } from '../keyhandler'
import { StorageHandler } from '../../storagehandler/storagehandler'
import { Injectable, Logger } from '@nestjs/common'
import { RestError } from '@azure/core-rest-pipeline'
import { RotatingKeyHandler } from '../rotatingkey/keyhandler.rotation'

@Injectable()
export class KeyVaultKeyHandler extends KeyHandler {
    private keyVaultUri: string | null = null

    private readonly secretClient: SecretClient

    constructor(
        private readonly configService: ConfigService,
        private readonly rotatingKeyHandler: RotatingKeyHandler,
        storageHandler: StorageHandler
    ) {
        super(storageHandler)

        this.keyVaultUri = this.configService.get<string>('AZURE_KEYVAULT_URI')

        if (!this.keyVaultUri) {
            throw new Error('No Azure Key Vault URI has been defined.')
        }

        const credential = new DefaultAzureCredential()
        this.secretClient = new SecretClient(this.keyVaultUri, credential)
    }

    public async init(keyNames: string[]): Promise<void> {
        for (const keyName of keyNames) {
            await this.deleteKey(keyName)
        }
    }

    protected async getKey(keyName: string): Promise<string | null> {
        try {
            let key = await this.getLocalKey(keyName)
            if (key)
                return await this.decrypt(
                    this.rotatingKeyHandler.getKey(),
                    this.rotatingKeyHandler.getIV(),
                    key
                )

            Logger.log(`Searching for key: ${keyName} in Azure Key Vault...`)
            key = (await this.secretClient.getSecret(keyName))?.value
            if (!key) return null

            const encryptedKey = await this.encrypt(
                this.rotatingKeyHandler.getKey(),
                this.rotatingKeyHandler.getIV(),
                key
            )
            if (encryptedKey) {
                await this.setLocalKey(keyName, encryptedKey)
            }
            return key
        } catch (e) {
            Logger.error(`Error retrieving key ${keyName}: ${e.message}`)
            if (e instanceof Error) {
                const error: RestError = e
                if (error.statusCode && error.statusCode == 404) {
                    return this.setKey(keyName)
                }
            }
            throw new Error(e)
        }
    }

    protected async setKey(keyName: string): Promise<string | null> {
        const key = crypto
            .generateKeySync('aes', {
                length: 256,
            })
            .export()
            .toString('hex')

        const keyVaultKey = await this.secretClient.setSecret(keyName, key)
        if (!keyVaultKey) return null

        const encryptedKey = await this.encrypt(
            this.rotatingKeyHandler.getKey(),
            this.rotatingKeyHandler.getIV(),
            key
        )
        if (!encryptedKey) return null

        const localKey = await this.setLocalKey(keyName, encryptedKey)
        if (!localKey) return null
        return key
    }

    protected async encrypt(
        key: crypto.KeyObject,
        iv: Buffer<ArrayBufferLike>,
        value: string
    ): Promise<string | null> {
        try {
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
            const encrypted = Buffer.concat([
                cipher.update(value, 'utf-8'),
                cipher.final(),
            ])

            return Buffer.concat([encrypted, cipher.getAuthTag()]).toString(
                'base64'
            )
        } catch (e) {
            Logger.error(`Error encrypting value: ${e.message}`)
        }
    }

    protected async decrypt(
        key: crypto.KeyObject,
        iv: Buffer<ArrayBufferLike>,
        value: string
    ): Promise<string | null> {
        try {
            const encryptedData = Buffer.from(value, 'base64')

            const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
            decipher.setAuthTag(
                encryptedData.subarray(
                    encryptedData.length - 16,
                    encryptedData.length
                )
            )

            const decrypted = Buffer.concat([
                decipher.update(
                    encryptedData.subarray(0, encryptedData.length - 16)
                ),
                decipher.final(),
            ])
            return decrypted.toString('utf-8')
        } catch (e) {
            Logger.error(`Error decrypting value: ${e.message}`)
            return null
        }
    }
}
