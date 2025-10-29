import { Controller, Delete, Get, Inject, Query, Logger } from '@nestjs/common'
import { NewsService } from './news.service'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { RssFeed } from './model/rssfeed.class'

@Controller({
    path: 'news',
    version: '0.1',
})
@ApiTags('news')
// @ApiBearerAuth()
// @UseGuards(AuthGuard())
export class NewsController {
    private readonly logger = new Logger(NewsController.name)

    constructor(
        private readonly newsService: NewsService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get()
    @ApiQuery({ name: 'id', required: false, type: String })
    @ApiQuery({ name: 'title', required: false, type: String })
    @ApiQuery({ name: 'datePublished', required: false, type: String })
    @ApiQuery({ name: 'dateCreated', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiOperation({
        summary: 'Returns configured RSS news feed in JSON format',
    })
    @ApiResponse({
        status: 200,
        type: RssFeed,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async getNews(
        @Query('id') id?: string,
        @Query('title') title?: string,
        @Query('datePublished') datePublished?: string,
        @Query('dateCreated') dateCreated?: string,
        @Query('category') category?: string
    ): Promise<any> {
        try {
            let newsFeed: RssFeed = await this.cacheManager.get('newsFeed')
            if (!newsFeed) {
                newsFeed = await this.newsService.getNews()
                await this.cacheManager.set('newsFeed', newsFeed)
            }

            let filteredItems = newsFeed.items
            let itemsFiltered: boolean = false

            if (id) {
                filteredItems = filteredItems.filter((item) =>
                    item.id?.includes(id)
                )
                itemsFiltered = true
            }

            if (title) {
                filteredItems = filteredItems.filter((item) =>
                    item.title?.includes(title)
                )
                itemsFiltered = true
            }

            if (datePublished) {
                filteredItems = filteredItems.filter(
                    (item) =>
                        new Number(item.published) > new Number(datePublished)
                )
                itemsFiltered = true
            }

            if (dateCreated) {
                filteredItems = filteredItems.filter(
                    (item) => new Number(item.created) > new Number(dateCreated)
                )
                itemsFiltered = true
            }

            if (category) {
                filteredItems = filteredItems.filter((item) =>
                    item.category?.includes(category)
                )
                itemsFiltered = true
            }

            if (itemsFiltered) {
                return filteredItems
            } else {
                return newsFeed
            }
        } catch (error) {
            this.logger.error(
                `Error fetching news: ${error.message}`,
                error.stack
            )
            throw error
        }
    }

    @Delete()
    @ApiOperation({ summary: 'Deletes news feed from cache' })
    @ApiResponse({
        status: 200,
        description: 'News feed deleted',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async deleteNews(): Promise<any> {
        await this.cacheManager.del('newsFeed')
        return { message: 'News feed deleted' }
    }
}
