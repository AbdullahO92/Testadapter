import { Module } from '@nestjs/common'
import { GenericAdapterController } from './generic-adapter.controller'
import { GenericAdapterService } from './generic-adapter.service'
import { ExternalSystemModule } from '../externalsystem/externalsystem.module'
import { TranslationModule } from '../translation/translation.module'
import { StorageHandlerModule } from '../storagehandler/storagehandler.module'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [ExternalSystemModule, TranslationModule, StorageHandlerModule],
    controllers: [GenericAdapterController],
    providers: [GenericAdapterService, PrismaService],
    exports: [GenericAdapterService],
})
export class GenericAdapterModule {}
