import { Enclosure } from './enclosure.class'
import { ApiProperty } from '@nestjs/swagger'

export class RssFeedItem {
    @ApiProperty()
    id: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    link: string

    @ApiProperty()
    published: number

    @ApiProperty()
    created: number

    @ApiProperty()
    category: string[]

    @ApiProperty()
    content: string

    @ApiProperty()
    enclosures: Enclosure[]

    @ApiProperty()
    content_encoded: string

    @ApiProperty()
    media: Record<string, unknown>
}
