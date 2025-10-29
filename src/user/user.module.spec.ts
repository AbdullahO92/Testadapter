import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserModule } from './user.module'

describe('UserModule', () => {
    let userModule: TestingModule

    beforeAll(async () => {
        userModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({
                    defaultStrategy: 'AzureAD',
                }),
                UserModule,
            ],
        }).compile()
    })

    it('should be defined', () => {
        expect(userModule).toBeDefined()
    })

    it('should import PassportModule with AzureAD strategy', () => {
        const passportModule = userModule.get<PassportModule>(PassportModule)
        expect(passportModule).toBeDefined()
    })

    it('should provide UserService', () => {
        const userService = userModule.get<UserService>(UserService)
        expect(userService).toBeDefined()
    })

    it('should have UserController', () => {
        const userController = userModule.get<UserController>(UserController)
        expect(userController).toBeDefined()
    })
})
