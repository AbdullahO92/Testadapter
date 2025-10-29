import { Test, TestingModule } from '@nestjs/testing'
import { NewsService } from './news.service'
import { NewsBroker } from './news.broker'
import { RssFeed } from './model/rssfeed.class'

describe('NewsService', () => {
    let service: NewsService
    let newsBroker: NewsBroker

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NewsService,
                {
                    provide: NewsBroker,
                    useValue: {
                        getNews: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<NewsService>(NewsService)
        newsBroker = module.get<NewsBroker>(NewsBroker)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should return news as a JSON string', async () => {
        const mockNews: RssFeed = { title: 'Test News' } as RssFeed
        jest.spyOn(newsBroker, 'getNews').mockResolvedValue(mockNews)

        const result = await service.getNews()

        expect(newsBroker.getNews).toHaveBeenCalled()
        expect(result).toEqual(mockNews)
    })

    it('should handle errors gracefully', async () => {
        jest.spyOn(newsBroker, 'getNews').mockRejectedValue(
            new Error('Failed to fetch news')
        )

        await expect(service.getNews()).rejects.toThrow('Failed to fetch news')
    })
})
