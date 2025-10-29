import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common'
import { GenericAdapterService } from './generic-adapter.service'
import { GenericAdapterPreviewDto } from './dto/generic-adapter-preview.dto'

@Controller('generic-adapter')
export class GenericAdapterController {
    constructor(
        private readonly genericAdapterService: GenericAdapterService
    ) {}

    @Post(':vendor/preview')
    async preview(
        @Param('vendor') vendor: string,
        @Body() previewDto: GenericAdapterPreviewDto
    ) {
        return this.genericAdapterService.preview(vendor, previewDto)
    }

    @Get('cache')
    async readCache(@Query('key') cacheKey: string) {
        if (!cacheKey) {
            throw new BadRequestException('Cache key is required.')
        }

        const cached = await this.genericAdapterService.readFromCache(cacheKey)
        return { cacheKey, notification: cached }
    }
}
