import { Module } from '@nestjs/common'
import { StorageHandler } from './storagehandler'
import { RedisStorageHandler } from './redis/storagehandler.redis'
import { ConfigService } from '@nestjs/config'

@Module({
    imports: [],
    exports: [StorageHandler],
    providers: [
        ConfigService,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class StorageHandlerModule {}
