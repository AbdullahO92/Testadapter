import { RssFeedItem } from './rssfeeditem.class'
import { ApiProperty } from '@nestjs/swagger'

export class RssFeed {
    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    link: string

    @ApiProperty()
    image: string

    @ApiProperty({ default: [], isArray: true })
    category: string[]

    @ApiProperty({ type: RssFeedItem, isArray: true })
    items: RssFeedItem[]
}
