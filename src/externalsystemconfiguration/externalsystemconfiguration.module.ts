import { Module } from '@nestjs/common'
import { ExternalSystemConfigurationRepository } from './externalsystemconfiguration.repository'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [ExternalSystemConfigurationRepository],
    providers: [ExternalSystemConfigurationRepository, PrismaService],
    controllers: [],
})
export class ExternalSystemConfigurationModule {}
