import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RssFeed } from './model/rssfeed.class'
const { parse } = require('rss-to-json')

@Injectable()
export class NewsBroker {
    constructor(private readonly configService: ConfigService) {}

    async getNews(): Promise<any> {
        const rssUrl = this.configService.get<string>('RSS_FEED_URL')
        if (!rssUrl) {
            throw new Error('RSS_FEED_URL is not defined in the configuration.')
        }
        const result: RssFeed = await parse(rssUrl)
        return result
    }
}
