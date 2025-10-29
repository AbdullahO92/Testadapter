import { Module } from '@nestjs/common'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { ExternalIdentityTokenRepository } from 'src/externalidentitytoken/externalidentitytoken.repository'
import { PrismaService } from 'src/prisma/prisma.service'
import { CanvasTokenHandler } from './tokenhandler.canvas'
import { ConfigService } from 'src/config/config.service'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'
import { KeyHandler } from 'src/keyhandler/keyhandler'
import { KeyVaultKeyHandler } from 'src/keyhandler/keyvault/keyhandler.keyvault'
import { ExternalIdentityTokenHandler } from 'src/tokenhandler-new/externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.refreshexpirydate'
import { ExternalSystemConfigurationHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalIdentityHandler } from 'src/entityhandler/externalidentity/externalidentityhandler'

@Module({
    imports: [],
    exports: [CanvasTokenHandler],
    providers: [
        ExternalSystemConfigurationHostHandler,
        ExternalIdentityTokenHandler,
        ExternalIdentityTokenExpiryHandler,
        ExternalIdentityTokenRefreshExpiryHandler,
        ConfigService,
        ExternalIdentityRepository,
        ExternalIdentityTokenRepository,
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
        {
            provide: KeyHandler,
            useClass: KeyVaultKeyHandler,
        },
        PrismaService,
        CanvasTokenHandler,
        ExternalSystemConfigurationHandler,
        ExternalIdentityHandler,
    ],
    controllers: [],
})
export class CanvasTokenHandlerModule {}
