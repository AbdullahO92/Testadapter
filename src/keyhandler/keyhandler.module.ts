import { Module } from '@nestjs/common'
import { KeyHandler } from './keyhandler'
import { KeyVaultKeyHandler } from './keyvault/keyhandler.keyvault'
import { ConfigService } from 'src/config/config.service'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [KeyHandler],
    providers: [
        ConfigService,
        {
            provide: KeyHandler,
            useClass: KeyVaultKeyHandler,
        },
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class KeyHandlerModule {}
