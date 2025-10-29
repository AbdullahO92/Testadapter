import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { IntegrationService } from './integration.service'
import { ExternalSystemConfiguration } from '@prisma/client'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

@Controller({
    path: 'integration',
    version: '0.1',
})
@ApiTags('integration')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class IntegrationController {
    constructor(private readonly integrationService: IntegrationService) {}

    @Get()
    @ApiOperation({ summary: 'Returns all integrations' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async findAll() {
        return await this.integrationService.findAll()
    }

    @Post()
    @ApiOperation({ summary: 'Creates new integration' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async create(@Body() integration: ExternalSystemConfiguration) {
        try {
            return await this.integrationService.create(integration)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Put()
    @ApiOperation({ summary: 'Updates integration' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async update(@Body() integration: ExternalSystemConfiguration) {
        try {
            return await this.integrationService.update(integration)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Delete()
    @ApiOperation({ summary: 'Deletes integration' })
    @ApiQuery({ name: 'id', required: true, type: String })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async delete(@Query() id: string) {
        try {
            return await this.integrationService.delete(id)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
