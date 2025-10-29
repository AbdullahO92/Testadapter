import { ApiProperty } from '@nestjs/swagger'

export class Enclosure {
    @ApiProperty()
    url: string

    @ApiProperty()
    length: string

    @ApiProperty()
    type: string
}
