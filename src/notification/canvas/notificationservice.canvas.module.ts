import { Module } from '@nestjs/common'
import { CanvasNotificationService } from './notification.canvas.service'
import { EventMappingHandler } from 'src/entityhandler/eventmapping/eventmappinghandler'
import { EventSubscriptionHandler } from 'src/entityhandler/eventsubscription/eventsubscriptionhandler'
import { ExternalIdentityHandler } from 'src/entityhandler/externalidentity/externalidentityhandler'
import { ExternalSystemHandler } from 'src/entityhandler/externalsystem/externalsystemhandler'
import { ExternalSystemConfigurationHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalSystemResponseHandler } from 'src/entityhandler/externalsystemresponse/externalsystemresponsehandler'
import { StateHandler } from 'src/statehandler/statehandler'
import { ExternalSystemRepository } from 'src/externalsystem/externalsystem.repository'
import { ExternalSystemConfigurationRepository } from 'src/externalsystemconfiguration/externalsystemconfiguration.repository'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { EventSubscriptionRepository } from 'src/eventsubscription/eventsubscription.repository'
import { UserService } from 'src/user/user.service'
import { CanvasTokenHandler } from 'src/tokenhandler/canvas/tokenhandler.canvas'
import { ConfigService } from '@nestjs/config'
import { StorageHandler } from 'src/storagehandler/storagehandler'
import { KeyHandler } from 'src/keyhandler/keyhandler'
import { KeyVaultKeyHandler } from 'src/keyhandler/keyvault/keyhandler.keyvault'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExternalIdentityTokenRepository } from 'src/externalidentitytoken/externalidentitytoken.repository'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { EventService } from 'src/event/event.service'
import { TranslationService } from 'src/translation/translation.service'
import { NotificationQueueService } from 'src/event/eventQueue.service'
import { EventMappingRepository } from 'src/eventmapping/eventmapping.service'
import { RedisStorageHandler } from 'src/storagehandler/redis/storagehandler.redis'
import { ExternalIdentityTokenHandler } from 'src/tokenhandler-new/externalidentitytokenhandler'
import { ExternalIdentityTokenExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.expirydate'
import { ExternalIdentityTokenRefreshExpiryHandler } from 'src/tokenhandler-new/externalidentitytokenhandler.refreshexpirydate'

@Module({
    imports: [],
    exports: [CanvasNotificationService],
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
        TranslationService,
        EventService,
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
    controllers: [],
})
export class CanvasNotificationServiceModule {}
