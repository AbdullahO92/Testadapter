import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    BadRequestException,
    UseGuards,
    Delete,
    Put,
} from '@nestjs/common'
import { UserPreferenceService } from './userpreference.service'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { UserPreference } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'

@Controller({
    path: 'userpreference',
    version: '0.1',
})
@ApiTags('userpreference')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserPreferenceController {
    constructor(
        private readonly userPreferenceService: UserPreferenceService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Creates new user preference' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async create(@Body() userPreference: UserPreference) {
        try {
            return await this.userPreferenceService.create(userPreference)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Put()
    @ApiOperation({ summary: 'Updates user preference' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async update(@Body() userPreference: UserPreference) {
        try {
            return await this.userPreferenceService.update(userPreference)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Get()
    @ApiOperation({ summary: 'Returns all user preferences' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async findAll() {
        return await this.userPreferenceService.findAll()
    }

    @Get('find')
    @ApiOperation({ summary: 'Returns user preference with specified id' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async findOne(@Query('id') id?: string) {
        try {
            return await this.userPreferenceService.findOne(id)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Delete()
    @ApiOperation({ summary: 'Deletes user preference with specified id' })
    @ApiQuery({ name: 'id', required: true, type: String })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async delete(@Query('id') id?: string) {
        try {
            await this.userPreferenceService.delete(id)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
