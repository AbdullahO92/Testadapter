import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
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
import { GenericAdapterService } from './generic-adapter.service'
import { GenericAdapterPreviewDto } from './dto/generic-adapter-preview.dto'

@Controller({ path: 'generic-adapter', version: '0.1' })
@ApiTags('generic-adapter')
@ApiBearerAuth()
@UseGuards(AuthGuard())
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
        @Body() previewDto: GenericAdapterPreviewDto
    ) {
        return this.genericAdapterService.preview(vendor, previewDto)
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
        @Body() previewDto: GenericAdapterPreviewDto
    ) {
        return this.genericAdapterService.dispatch(vendor, previewDto)
    }
}
