import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'
import { AzureADStrategy } from '../src/authentication/strategies/azuread.strategy'
import { INestApplication } from '@nestjs/common'

describe('AzureADStrategy', () => {
    let app: INestApplication
    const audience = 'your-audience'
    const tenantId = 'your-tenant-id'

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'AzureAD' })],
            providers: [
                {
                    provide: 'AzureADStrategy',
                    useFactory: () => new AzureADStrategy(audience, tenantId),
                },
            ],
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should validate JWT token', async () => {
        const strategy = app.get<AzureADStrategy>('AzureADStrategy')
        const payload = { sub: 'user-id', name: 'John Doe' }
        const result = strategy.validate(payload)
        expect(result).toEqual(payload)
    })
})
