import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { GenericAdapterService } from './genericadapter.service'
import { GenericAdapterPreviewDto } from './dto/genericadapter-preview.dto'

@Controller({ path: 'generic-adapter', version: '0.1' })
@ApiTags('generic-adapter')
@ApiBearerAuth()
 ///@UseGuards(AuthGuard())
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    })
)
export class GenericAdapterController {
    constructor(
        private readonly genericAdapterService: GenericAdapterService
    ) {}

    @Post(':vendor/preview')
    @ApiOperation({ summary: 'Preview a notification payload for a vendor' })
    @ApiResponse({ status: 200, description: 'Preview generated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request payload' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async preview(
        @Param('vendor') vendor: string,
        @Body() previewDto: GenericAdapterPreviewDto,
        @Req() request: Request

    ) {
        return this.genericAdapterService.preview(
            vendor,
            this.applyDefaults(vendor, previewDto, request)
        )
    }

    @Get('cache')
    @ApiOperation({ summary: 'Read a cached preview payload' })
    @ApiResponse({ status: 200, description: 'Cached payload returned' })
    @ApiResponse({ status: 400, description: 'Cache key not provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async readCache(@Query('key') cacheKey: string) {
        if (!cacheKey) {
            throw new BadRequestException('Cache key is required.')
        }

        const cached = await this.genericAdapterService.readFromCache(cacheKey)
        return { cacheKey, notification: cached }
    }

    @Post(':vendor/dispatch')
    @ApiOperation({
        summary: 'Send a vendor payload to the notification pipeline',
    })
    @ApiResponse({
        status: 200,
        description: 'Notification queued for delivery',
    })
    @ApiResponse({ status: 400, description: 'Invalid request payload' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async dispatch(
        @Param('vendor') vendor: string,
        @Body() previewDto: GenericAdapterPreviewDto,
        @Req() request: Request
    ) {
        return this.genericAdapterService.dispatch(
            vendor,
            this.applyDefaults(vendor, previewDto, request)
        )
    }

    private applyDefaults(
        vendor: string,
        previewDto: GenericAdapterPreviewDto,
        request: Request
    ): GenericAdapterPreviewDto {
        const userFromToken = (request.user as any)?.oid
        const defaultUserId =
            process.env.DEFAULT_PREVIEW_USER_ID ??
            'a63d77ed-1fe7-42b0-8fde-243df9b83b6e'

        const baseDefaults: GenericAdapterPreviewDto = {
            ...previewDto,
            userId: previewDto.userId ?? userFromToken ?? defaultUserId,
            responseInternalName: previewDto.responseInternalName,
        }

        if (
            vendor === 'campus-solutions' &&
            !baseDefaults.responseInternalName
        ) {
            baseDefaults.responseInternalName =
                'campus_solutions_schedule_change'
        }

        return baseDefaults
    }
}