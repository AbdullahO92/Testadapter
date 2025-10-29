import { Test, TestingModule } from '@nestjs/testing'
import { IntegrationController } from './integration.controller'
import { IntegrationService } from './integration.service'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'

describe('IntegrationController', () => {
    let controller: IntegrationController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'AzureAD' })],
            controllers: [IntegrationController],
            providers: [
                {
                    provide: IntegrationService,
                    useValue: {},
                },
                {
                    provide: PrismaService,
                    useValue: {},
                },
            ],
        }).compile()

        controller = module.get<IntegrationController>(IntegrationController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
