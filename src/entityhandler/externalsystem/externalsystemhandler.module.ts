import { Global, Module } from '@nestjs/common'
import { ExternalSystemHandler } from './externalsystemhandler'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [ExternalSystemHandler],
    providers: [
        ExternalSystemHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class ExternalSystemHandlerModule {}
