import { Test, TestingModule } from '@nestjs/testing'
import { UserPreferenceController } from './userpreference.controller'
import { PassportModule } from '@nestjs/passport'
import { UserPreferenceService } from './userpreference.service'
import { PrismaService } from '../prisma/prisma.service'

describe('UserpreferenceController', () => {
    let controller: UserPreferenceController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'AzureAD' }), // Include PassportModule in tests
            ],
            controllers: [UserPreferenceController],
            providers: [
                {
                    provide: UserPreferenceService,
                    useValue: {},
                },
                {
                    provide: PrismaService,
                    useValue: {},
                },
            ],
        }).compile()

        controller = module.get<UserPreferenceController>(
            UserPreferenceController
        )
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
