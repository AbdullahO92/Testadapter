import { Test, TestingModule } from '@nestjs/testing'
import { IntegrationModule } from './integration.module'
import { IntegrationService } from './integration.service'
import { IntegrationController } from './integration.controller'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from '../prisma/prisma.service'

describe('IntegrationModule', () => {
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                PassportModule.register({
                    defaultStrategy: 'AzureAD',
                }),
                IntegrationModule,
            ],
            providers: [IntegrationService, PrismaService],
            controllers: [IntegrationController],
        }).compile()
    })

    it('should compile the module', () => {
        const integrationModule =
            module.get<IntegrationModule>(IntegrationModule)
        expect(integrationModule).toBeDefined()
    })

    it('should provide IntegrationService', () => {
        const integrationService =
            module.get<IntegrationService>(IntegrationService)
        expect(integrationService).toBeDefined()
    })

    it('should provide PrismaService', () => {
        const prismaService = module.get<PrismaService>(PrismaService)
        expect(prismaService).toBeDefined()
    })

    it('should have IntegrationController', () => {
        const integrationController = module.get<IntegrationController>(
            IntegrationController
        )
        expect(integrationController).toBeDefined()
    })
})
