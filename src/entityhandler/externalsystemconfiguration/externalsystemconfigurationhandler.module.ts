import { Global, Module } from '@nestjs/common'
import { ExternalSystemConfigurationHandler } from './externalsystemconfigurationhandler'
import { ExternalSystemConfigurationHostHandler } from './externalsystemconfigurationhandler.host'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'

@Module({
    imports: [],
    exports: [
        ExternalSystemConfigurationHandler,
        ExternalSystemConfigurationHostHandler,
    ],
    providers: [
        ExternalSystemConfigurationHandler,
        ExternalSystemConfigurationHostHandler,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
    ],
    controllers: [],
})
export class ExternalSystemConfigurationHandlerModule {}
