import { Test, TestingModule } from '@nestjs/testing'
import { CacheModule } from '@nestjs/cache-manager'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { NewsModule } from './news.module'
import { NewsService } from './news.service'
import { NewsBroker } from './news.broker'
import { NewsController } from './news.controller'

describe('NewsModule', () => {
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule,
                PassportModule.register({
                    defaultStrategy: 'AzureAD',
                }),
                CacheModule.register({
                    ttl: 900, // seconds
                }),
                NewsModule,
            ],
            controllers: [NewsController],
            providers: [NewsService, NewsBroker],
        }).compile()
    })

    it('should compile the module', () => {
        const newsModule = module.get<NewsModule>(NewsModule)
        expect(newsModule).toBeDefined()
    })

    it('should provide NewsService', () => {
        const newsService = module.get<NewsService>(NewsService)
        expect(newsService).toBeDefined()
    })

    it('should provide NewsBroker', () => {
        const newsBroker = module.get<NewsBroker>(NewsBroker)
        expect(newsBroker).toBeDefined()
    })

    it('should provide NewsController', () => {
        const newsController = module.get<NewsController>(NewsController)
        expect(newsController).toBeDefined()
    })
})
