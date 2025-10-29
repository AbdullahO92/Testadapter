import { Module } from '@nestjs/common'
import { ExternalSystemResponseHandler } from './externalsystemresponsehandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [ExternalSystemResponseHandler],
    providers: [
        ExternalSystemResponseHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class ExternalSystemResponseHandlerModule {}
