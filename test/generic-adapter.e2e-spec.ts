import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

const describeOrSkip = process.env.RUN_GENERIC_ADAPTER_E2E
    ? describe
    : describe.skip

describeOrSkip('GenericAdapterController (e2e)', () => {
    let app: INestApplication
    const prismaMock = {
        user: { findUnique: jest.fn().mockResolvedValue(null) },
        externalSystem: { findFirst: jest.fn().mockResolvedValue(null) },
        externalSystemConfiguration: {
            findMany: jest.fn().mockResolvedValue([]),
        },
    }

    beforeAll(() => {
        process.env.AZURE_SERVICE_BUS_CONNECTION_STRING =
            process.env.AZURE_SERVICE_BUS_CONNECTION_STRING ||
            'Endpoint=sb://localhost/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=dummy='
        process.env.AZURE_SERVICE_BUS_QUEUE_NAME =
            process.env.AZURE_SERVICE_BUS_QUEUE_NAME || 'test-queue'
        process.env.AZURE_KEYVAULT_URI =
            process.env.AZURE_KEYVAULT_URI ||
            'https://example.vault.azure.net/'
        process.env.CANVAS_CLIENT_ID =
            process.env.CANVAS_CLIENT_ID || 'client-id'
        process.env.CANVAS_CLIENT_SECRET =
            process.env.CANVAS_CLIENT_SECRET || 'client-secret'
        process.env.CANVAS_API_VERSION =
            process.env.CANVAS_API_VERSION || 'v1'
        process.env.API_HOST = process.env.API_HOST || 'https://example.cy2.com'
        process.env.DATABASE_URL =
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/postgres?schema=public'
    })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prismaMock)
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    it('should reject unauthorized preview requests', async () => {
        await request(app.getHttpServer())
            .post('/v0.1/generic-adapter/canvas/preview')
            .send({})
            .expect(401)
    })
})
