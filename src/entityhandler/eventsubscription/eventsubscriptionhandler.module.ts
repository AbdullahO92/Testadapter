import { Module } from '@nestjs/common'
import { EventSubscriptionHandler } from './eventsubscriptionhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [EventSubscriptionHandler],
    providers: [
        EventSubscriptionHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class EventSubscriptionHandlerModule {}
