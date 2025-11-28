import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator'

export class GenericAdapterPreviewDto {
    @ApiProperty({
        description: 'Identifier of the SCA user requesting the preview',
        example: 'a63d77ed-1fe7-42b0-8fde-243df9b83b6e',
    })
    @IsUUID()
    userId: string

    @ApiProperty({
        description: 'Internal name of the external system response to preview',
        example: 'canvas_announcement',
    })
    @IsString()
    responseInternalName: string

    @ApiPropertyOptional({
        description: 'Optional identifier of the configuration to use for dispatching',
        example: '00000000-0000-0000-0000-000000000001',
    })
    @IsOptional()
    @IsUUID()
    configurationId?: string

    @ApiPropertyOptional({
        description: 'Vendor payload or request parameters',
        type: Object,
        example: {
            title: 'Exam reminder',
            message: 'Final exam on Friday',
        },
    })
    @IsOptional()
    @IsObject()
    payload?: Record<string, any>

    @ApiPropertyOptional({
        description: 'Optional vendor specific resource path (relative to configuration domain)',
        example: '/api/v1/courses/1/announcements',
    })
    @IsOptional()
    @IsString()
    resourcePath?: string

    @ApiPropertyOptional({
        description: 'Optional query parameters used when fetching vendor data',
        type: Object,
        example: {
            include: 'content',
        },
    })
    @IsOptional()
    @IsObject()
    query?: Record<string, any>

    @ApiPropertyOptional({
        description: 'Optional request body used when fetching vendor data',
        type: Object,
        example: {
            includeSensitive: false,
        },
    })
    @ValidateIf((_, value) => value !== undefined)
    @IsObject()
    body?: Record<string, any>
}