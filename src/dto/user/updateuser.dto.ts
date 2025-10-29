import { ApiProperty } from '@nestjs/swagger'

export class UpdateTermsAgreedDto {
    @ApiProperty({
        description: 'The id of the user',
    })
    userId: string
}
