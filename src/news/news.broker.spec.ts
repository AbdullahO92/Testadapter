import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { NewsBroker } from './news.broker'
import * as rssToJson from 'rss-to-json'

jest.mock('rss-to-json', () => ({
    parse: jest.fn(),
}))

describe('NewsBroker', () => {
    let newsBroker: NewsBroker
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NewsBroker,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile()

        newsBroker = module.get<NewsBroker>(NewsBroker)
        configService = module.get<ConfigService>(ConfigService)
    })

    it('should be defined', () => {
        expect(newsBroker).toBeDefined()
    })

    it('should throw an error if RSS_FEED_URL is not defined', async () => {
        jest.spyOn(configService, 'get').mockReturnValue(undefined)

        await expect(newsBroker.getNews()).rejects.toThrow(
            'RSS_FEED_URL is not defined in the configuration.'
        )
    })

    it('should return parsed RSS feed data', async () => {
        const mockRssUrl = 'http://example.com/rss'
        const mockRssData = { title: 'Test RSS Feed' }

        jest.spyOn(configService, 'get').mockReturnValue(mockRssUrl)
        ;(rssToJson.parse as jest.Mock).mockResolvedValue(mockRssData)

        const result = await newsBroker.getNews()

        expect(configService.get).toHaveBeenCalledWith('RSS_FEED_URL')
        expect(rssToJson.parse).toHaveBeenCalledWith(mockRssUrl)
        expect(result).toEqual(mockRssData)
    })
})
