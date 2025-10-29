import { Injectable } from '@nestjs/common'
import { NewsBroker } from './news.broker'
import { RssFeed } from './model/rssfeed.class'

@Injectable()
export class NewsService {
    constructor(private readonly newsBroker: NewsBroker) {}

    async getNews(): Promise<any> {
        const result: RssFeed = await this.newsBroker.getNews()
        return result
    }
}
