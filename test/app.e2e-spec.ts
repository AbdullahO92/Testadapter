import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { UserService } from './../src/user/user.service'

describe('UserController (e2e)', () => {
    let app: INestApplication
    let userService = {
        getGreetings: jest.fn().mockResolvedValue('Hello, World!'),
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(UserService)
            .useValue(userService)
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    it('Should reject unauthorized requests', () => {
        return request(app.getHttpServer())
            .get('/user')
            .expect(401)
            .expect('{"message":"Unauthorized","statusCode":401}')
    })
})
