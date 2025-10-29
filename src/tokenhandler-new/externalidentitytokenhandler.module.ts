import { Global, Module } from '@nestjs/common'
import { ExternalIdentityTokenHandler } from './externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from './externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from './externalidentitytokenhandler.refreshexpirydate'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'
import { KeyHandler } from 'src/keyhandler/keyhandler'
import { KeyVaultKeyHandler } from 'src/keyhandler/keyvault/keyhandler.keyvault'

@Module({
    imports: [],
    exports: [
        ExternalIdentityTokenHandler,
        ExternalIdentityTokenExpiryHandler,
        ExternalIdentityTokenRefreshExpiryHandler,
    ],
    providers: [
        ExternalIdentityTokenHandler,
        ExternalIdentityTokenExpiryHandler,
        ExternalIdentityTokenRefreshExpiryHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
        {
            provide: KeyHandler,
            useClass: KeyVaultKeyHandler,
        },
    ],
    controllers: [],
})
export class ExternalIdentityTokenHandlerModule {}
