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
import { BrightspaceConnector } from './connectors/brightspace.connector'
import { BlackboardConnector } from './connectors/blackboard.connector'
import { CampusSolutionsConnector } from './connectors/campus-solutions.connector'
import { EventMappingRepository } from '../eventmapping/eventmapping.service'

const connectorProviders = [
    CanvasConnector,
    BrightspaceConnector,
    BlackboardConnector,
    CampusSolutionsConnector,
    {
        provide: GENERIC_ADAPTER_CONNECTORS,
        useFactory: (
            canvas: CanvasConnector,
            brightspace: BrightspaceConnector,
            blackboard: BlackboardConnector,
            campusSolutions: CampusSolutionsConnector
        ) => [canvas, brightspace, blackboard, campusSolutions],
        inject: [
            CanvasConnector,
            BrightspaceConnector,
            BlackboardConnector,
            CampusSolutionsConnector,
        ],
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
