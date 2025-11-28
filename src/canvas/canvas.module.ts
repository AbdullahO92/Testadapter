import { Module } from '@nestjs/common'
import { CanvasController } from './canvas.controller'
import { CanvasNotificationService } from 'src/notification/canvas/notification.canvas.service'
import { ConfigService } from '@nestjs/config'
import { ExternalSystemRepository } from 'src/externalsystem/externalsystem.repository'
import { ExternalSystemConfigurationRepository } from 'src/externalsystemconfiguration/externalsystemconfiguration.repository'
import { EventMappingHandler } from 'src/entityhandler/eventmapping/eventmappinghandler'
import { EventSubscriptionHandler } from 'src/entityhandler/eventsubscription/eventsubscriptionhandler'
import { ExternalIdentityHandler } from 'src/entityhandler/externalidentity/externalidentityhandler'
import { ExternalSystemHandler } from 'src/entityhandler/externalsystem/externalsystemhandler'
import { ExternalSystemConfigurationHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { ExternalSystemResponseHandler } from 'src/entityhandler/externalsystemresponse/externalsystemresponsehandler'
import { EventService } from 'src/event/event.service'
import { NotificationQueueService } from 'src/event/eventQueue.service'
import { EventMappingRepository } from 'src/eventmapping/eventmapping.service'
import { EventSubscriptionRepository } from 'src/eventsubscription/eventsubscription.repository'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { ExternalIdentityTokenRepository } from 'src/externalidentitytoken/externalidentitytoken.repository'
import { KeyHandler } from 'src/keyhandler/keyhandler'
import { KeyVaultKeyHandler } from 'src/keyhandler/keyvault/keyhandler.keyvault'
import { PrismaService } from 'src/prisma/prisma.service'
import { StateHandler } from 'src/statehandler/statehandler'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { ExternalIdentityTokenHandler } from 'src/tokenhandler-new/externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.refreshexpirydate'
import { CanvasTokenHandler } from 'src/tokenhandler/canvas/tokenhandler.canvas'
import { TRANSLATION_PROVIDERS } from 'src/translation/translation.providers'
import { UserService } from 'src/user/user.service'

@Module({
    providers: [
        CanvasNotificationService,
        EventMappingHandler,
        EventSubscriptionHandler,
        ExternalIdentityHandler,
        ExternalSystemHandler,
        ExternalSystemConfigurationHandler,
        ExternalSystemConfigurationHostHandler,
        ExternalSystemResponseHandler,
        ExternalIdentityTokenHandler,
        ExternalIdentityTokenExpiryHandler,
        ExternalIdentityTokenRefreshExpiryHandler,
        StateHandler,
        ExternalSystemRepository,
        ExternalSystemConfigurationRepository,
        ExternalIdentityRepository,
        EventSubscriptionRepository,
        UserService,
        NotificationQueueService,
        ExternalIdentityTokenRepository,
        EventMappingRepository,
        EventService,
        ...TRANSLATION_PROVIDERS,
        CanvasTokenHandler,
        ConfigService,
        {
            provide: KeyHandler,
            useClass: KeyVaultKeyHandler,
        },
        {
            provide: StorageHandler,
            useClass: RedisStorageHandler,
        },
        PrismaService,
    ],
    exports: [],
    imports: [],
    controllers: [CanvasController],
})
export class CanvasModule {}
