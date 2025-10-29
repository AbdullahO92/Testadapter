import { Module } from '@nestjs/common'
import { StateHandler } from './statehandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [StateHandler],
    providers: [
        StateHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class StateHandlerModule {}
