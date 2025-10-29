import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from './config.service'
import { Config } from '@prisma/client'

@Controller({
    path: 'config',
    version: '0.1',
})
@ApiTags('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}

    @Get(':key')
    @ApiOperation({ summary: 'Get configuration by key' })
    async getConfig(@Param('key') key: string): Promise<Config> {
        return await this.configService.get(key)
    }
}
