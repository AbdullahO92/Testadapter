import { Module } from '@nestjs/common'
import { ExternalIdentityHandler } from './externalidentityhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [ExternalIdentityHandler],
    providers: [
        ExternalIdentityHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class ExternalIdentityHandlerModule {}
