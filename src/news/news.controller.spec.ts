import { Test, TestingModule } from '@nestjs/testing'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

describe('NewsController', () => {
    let newsController: NewsController
    let newsService: NewsService
    let cacheManager: Cache

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NewsController],
            providers: [
                {
                    provide: NewsService,
                    useValue: {
                        getNews: jest
                            .fn()
                            .mockResolvedValue([{ title: 'Test News' }]),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile()

        newsController = module.get<NewsController>(NewsController)
        newsService = module.get<NewsService>(NewsService)
        cacheManager = module.get<Cache>(CACHE_MANAGER)
    })

    it('should be defined', () => {
        expect(newsController).toBeDefined()
    })

    describe('getNews', () => {
        it('should return news from cache if available', async () => {
            const cachedNews = [{ title: 'Cached News' }]
            jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedNews)

            const result = await newsController.getNews()
            expect(result).toEqual(cachedNews)
            expect(cacheManager.get).toHaveBeenCalledWith('newsFeed')
            expect(newsService.getNews).not.toHaveBeenCalled()
        })

        it('should return news from service and cache it if not in cache', async () => {
            const freshNews = [{ title: 'Fresh News' }]
            jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined)
            jest.spyOn(newsService, 'getNews').mockResolvedValue(freshNews)

            const result = await newsController.getNews()
            expect(result).toEqual(freshNews)
            expect(cacheManager.get).toHaveBeenCalledWith('newsFeed')
            expect(newsService.getNews).toHaveBeenCalled()
            expect(cacheManager.set).toHaveBeenCalledWith('newsFeed', freshNews)
        })
    })
})
