import { Module } from '@nestjs/common'
import { IntegrationService } from './integration.service'
import { IntegrationController } from './integration.controller'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'AzureAD',
        }),
    ],
    providers: [IntegrationService, PrismaService],
    controllers: [IntegrationController],
})
export class IntegrationModule {}
