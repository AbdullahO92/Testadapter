import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { UserService } from './user.service'
import { UpdateTermsAgreedDto } from '../dto/user/updateuser.dto'

@Controller({
    path: 'user',
    version: '0.1',
})
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Creates new user' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async create(@Body() user: User) {
        try {
            return await this.userService.create(user)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Put()
    @ApiOperation({ summary: 'Updates user' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async update(@Body() updatedUser: User) {
        try {
            return this.userService.update(updatedUser)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Get()
    @ApiOperation({ summary: 'Returns all users' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async findAll() {
        return this.userService.findAll()
    }

    @Get('find')
    @ApiOperation({ summary: 'Returns user with specified id' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    @ApiQuery({ name: 'id', required: true, type: String })
    async findOne(@Query('id') id?: string) {
        const user = await this.userService.findOne(id)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user
    }

    @Delete()
    @ApiOperation({ summary: 'Deletes user' })
    @ApiQuery({ name: 'id', required: true, type: String })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    @ApiQuery({ name: 'id', required: true, type: String })
    async remove(@Query('id') id?: string) {
        return this.userService.delete(id)
    }

    @Post('/privacyterms/update')
    @ApiOperation({ summary: 'Updates user privacy agreed' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async updatePrivacyAgreed(@Body() updatePrivacy: UpdateTermsAgreedDto) {
        return await this.userService
            .updatePrivacy(updatePrivacy)
            .then(() => {
                return { message: 'Privacy terms updated successfully' }
            })
            .catch((e) => {
                throw new BadRequestException(e)
            })
    }

    @Post('/usageterms/update')
    @ApiOperation({ summary: 'Updates user terms agreed' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    async updateTerms(@Body() updateTerms: UpdateTermsAgreedDto) {
        return await this.userService
            .updateTerms(updateTerms)
            .then(() => {
                return { message: 'Terms updated successfully' }
            })
            .catch((e) => {
                throw new BadRequestException(e)
            })
    }

    @Get('/agreements')
    @ApiOperation({ summary: 'Returns user agreements' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        example: {
            message: 'Unauthorized',
            statusCode: 401,
        },
    })
    @ApiQuery({ name: 'id', required: true, type: String })
    async getAgreements(@Query('id') id?: string) {
        try {
            return this.userService.getAgreements(id)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
