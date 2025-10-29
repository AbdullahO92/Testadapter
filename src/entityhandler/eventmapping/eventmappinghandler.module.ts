import { Module } from '@nestjs/common'
import { EventMappingHandler } from './eventmappinghandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [EventMappingHandler],
    providers: [
        EventMappingHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class EventMappingHandlerModule {}
