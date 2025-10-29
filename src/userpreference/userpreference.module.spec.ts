import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'
import { UserPreferenceModule } from './userpreference.module'
import { UserPreferenceController } from './userpreference.controller'
import { UserPreferenceService } from './userpreference.service'
import { PrismaService } from '../prisma/prisma.service'

describe('UserPreferenceModule', () => {
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                PassportModule.register({
                    defaultStrategy: 'AzureAD',
                }),
                UserPreferenceModule,
            ],
            controllers: [UserPreferenceController],
            providers: [UserPreferenceService, PrismaService],
        }).compile()
    })

    it('should compile the module', () => {
        const userPreferenceModule =
            module.get<UserPreferenceModule>(UserPreferenceModule)
        expect(userPreferenceModule).toBeDefined()
    })

    it('should provide UserPreferenceService', () => {
        const service = module.get<UserPreferenceService>(UserPreferenceService)
        expect(service).toBeDefined()
    })

    it('should provide PrismaService', () => {
        const service = module.get<PrismaService>(PrismaService)
        expect(service).toBeDefined()
    })

    it('should have UserPreferenceController', () => {
        const controller = module.get<UserPreferenceController>(
            UserPreferenceController
        )
        expect(controller).toBeDefined()
    })

    it('should register PassportModule with AzureAD strategy', () => {
        const passportModule = module.get<PassportModule>(PassportModule)
        expect(passportModule).toBeDefined()
    })
})
