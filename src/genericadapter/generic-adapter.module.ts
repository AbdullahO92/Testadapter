import { Module } from '@nestjs/common'
import { GenericAdapterController } from './generic-adapter.controller'
import { GenericAdapterService } from './generic-adapter.service'
import { ExternalSystemModule } from '../externalsystem/externalsystem.module'
import { TranslationModule } from '../translation/translation.module'
import { StorageHandlerModule } from '../storagehandler/storagehandler.module'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalSystemConfigurationModule } from '../externalsystemconfiguration/externalsystemconfiguration.module'
import { EventModule } from '../event/event.module'
import { GenericAdapterConnectorRegistry, GENERIC_ADAPTER_CONNECTORS } from './connectors/connector.registry'
import { CanvasConnector } from './connectors/canvas.connector'
import { GenericAdapterConnector } from './connectors/generic-adapter.connector'
import { EventMappingRepository } from '../eventmapping/eventmapping.service'

const connectorClasses = [CanvasConnector]

const connectorProviders = [
    ...connectorClasses,
    {
        provide: GENERIC_ADAPTER_CONNECTORS,
        useFactory: (...connectors: GenericAdapterConnector[]) => connectors,
        inject: connectorClasses,
    },
]

@Module({
    imports: [
        ExternalSystemModule,
        ExternalSystemConfigurationModule,
        TranslationModule,
        StorageHandlerModule,
        EventModule,
    ],
    controllers: [GenericAdapterController],
    providers: [
        GenericAdapterService,
        PrismaService,
        GenericAdapterConnectorRegistry,
        EventMappingRepository,
        ...connectorProviders,
    ],
    exports: [GenericAdapterService],
})
export class GenericAdapterModule {}
