import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'

import { AzureADStrategy } from './authentication/strategies/azuread.strategy'
import { CanvasModule } from './canvas/canvas.module'
import { GenericAdapterModule } from './genericadapter/genericadapter.module'
import { ConfigModule as KeyValueConfig } from './config/config.module'
import { EduModule } from './edu/edu.module'
import { EventMappingModule } from './eventmapping/eventmapping.module'
import { EventSubscriptionModule } from './eventsubscription/eventsubscription.module'
import { ExternalSystemModule } from './externalsystem/externalsystem.module'
import { ExternalSystemConfigurationModule } from './externalsystemconfiguration/externalsystemconfiguration.module'

import { TranslationModule } from './translation/translation.module'

import { EventMappingHandlerModule } from './entityhandler/eventmapping/eventmappinghandler.module'
import { EventSubscriptionHandlerModule } from './entityhandler/eventsubscription/eventsubscriptionhandler.module'
import { ExternalIdentityHandlerModule } from './entityhandler/externalidentity/externalidentityhandler.module'
import { ExternalSystemHandlerModule } from './entityhandler/externalsystem/externalsystemhandler.module'
import { ExternalSystemConfigurationHandlerModule } from './entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.module'
import { ExternalSystemResponseHandlerModule } from './entityhandler/externalsystemresponse/externalsystemresponsehandler.module'
import { EventModule } from './event/event.module'
import { ExternalIdentityModule } from './externalidentity/externalidentity.module'
import { ExternalIdentityTokenModule } from './externalidentitytoken/externalidentitytoken.module'
import { ExternalSystemResponseModule } from './externalsystemresponse/externalsystemresponse.module'
import { IntegrationModule } from './integration/integration.module'
import { KeyHandlerModule } from './keyhandler/keyhandler.module'
import { RotatingKeyHandlerModule } from './keyhandler/rotatingkey/keyhandler.rotation.module'
import { NewsModule } from './news/news.module'
import { CanvasNotificationCronServiceModule } from './notification/canvas/cron/notification.canvas.cron.service.module'
import { CanvasNotificationServiceModule } from './notification/canvas/notificationservice.canvas.module'
import { StateHandlerModule } from './statehandler/statehandler.module'
import { StorageHandlerModule } from './storagehandler/storagehandler.module'
import { ExternalIdentityTokenHandlerModule } from './tokenhandler-new/externalidentitytokenhandler.module'
import { CanvasTokenHandlerModule } from './tokenhandler/canvas/tokenhandler.canvas.module'
import { UserModule } from './user/user.module'
import { UserPreferenceModule } from './userpreference/userpreference.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        TranslationModule,
        StorageHandlerModule,
        StateHandlerModule,
        RotatingKeyHandlerModule,
        KeyHandlerModule,
        EventMappingHandlerModule,
        EventSubscriptionHandlerModule,
        ExternalIdentityHandlerModule,
        ExternalSystemConfigurationHandlerModule,
        ExternalSystemResponseHandlerModule,
        ExternalSystemHandlerModule,
        ExternalIdentityTokenHandlerModule,
        EduModule,
        UserModule,
        NewsModule,
        ExternalIdentityModule,
        ExternalIdentityTokenModule,
        EventMappingModule,
        EventSubscriptionModule,
        UserPreferenceModule,
        IntegrationModule,
        EventModule,
        ExternalSystemModule,
        ExternalSystemConfigurationModule,
        ExternalSystemResponseModule,
        GenericAdapterModule,
        KeyValueConfig,
        CanvasModule,
        CanvasTokenHandlerModule,
        CanvasNotificationServiceModule,
        CanvasNotificationCronServiceModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
    ],
    controllers: [],
    providers: [
        // {
        //     provide: ConfigService,
        //     useFactory: (configService: ConfigService) => {
        //         const azureKeyVaultURI: string = process.env.AZURE_KEYVAULT_URI

        //         return new AzureKeyVaultConfigService(azureKeyVaultURI)
        //     },
        // },
        {
            provide: AzureADStrategy,
            useFactory: async () => {
                const audience = process.env.AZURE_AD_AUDIENCE
                const tenantId = process.env.AZURE_AD_TENANT_ID
                return new AzureADStrategy(audience, tenantId)
            },
            inject: [ConfigService],
        },
    ],
})
export class AppModule {}
