import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    HttpException,
    HttpStatus,
    Logger,
    Query,
    Req,
    Res,
    Sse,
    MessageEvent,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'
import { fromEvent, map, Observable } from 'rxjs'
import { CanvasNotificationService } from 'src/notification/canvas/notification.canvas.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Controller({
    path: 'api/canvas',
    version: '0.1',
})
@ApiTags('canvas')
export class CanvasController {
    private readonly TeamsAppId: string
    private readonly TeamsTenantId: string
    constructor(
        private readonly configService: ConfigService,
        private readonly service: CanvasNotificationService,
        private readonly eventEmitter: EventEmitter2
    ) {
        this.TeamsAppId = this.configService.get<string>('TEAMS_APP_ID')
        this.TeamsTenantId =
            this.configService.get<string>('AZURE_AD_TENANT_ID')
    }

    @Get('init')
    async initialize(
        @Query('user') userId: string,
        @Req() request: Request,
        @Res() response
    ) {
        try {
            const host = request.headers['host']
            if (host == null) {
                throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
            }

            const redirectUrl = await this.service.initiateAuthorization(userId)
            if (redirectUrl != null) {
                Logger.log(`Redirecting to: ${redirectUrl}`)
                return response.redirect(redirectUrl)
            } else {
                Logger.error('Redirect URL is null')
            }
            Logger.error('Failed to initiate authorization')
            return response.badRequest()
        } catch (e) {
            Logger.error(`Error during initialization: ${e.message}`)
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('auth')
    async authenticate(
        @Query('code') code: string,
        @Query('state') state: string,
        @Req() request: Request,
        @Res() response
    ) {
        try {
            const host = request.headers['host']
            if (host == null) {
                throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
            }

            await this.service.finalizeAuthorization(code, state)
            // state is a btoa
            const decodedState = Buffer.from(state, 'base64').toString('utf-8')
            if (!decodedState) {
                Logger.error('Decoded state is empty')
                throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
            }

            const userId = decodedState.split('|')[1]
            if (!userId) {
                Logger.error('User ID is missing in decoded state')
                throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
            }

            Logger.log(`Authentication successful for user: ${decodedState}`)

            this.eventEmitter.emit('sse.event', {
                type: 'canvas-auth',
                userId: userId,
                message: 'Canvas notifications have been set up successfully.',
            })

            return response.send(`
                <html>
                <head>
                    <title>Canvas Notification Setup</title>
                </head>
                <body>
                    <h1>Canvas Notification Setup</h1>
                    <p>Canvas notifications have been successfully set up.</p>
                    <p>You can now close this window.</p>
                </body>
                </html>
            `)
        } catch (e) {
            console.log(e)
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('validate')
    async validate(@Query('user') user: string, @Res() response) {
        try {
            const result = await this.service.isAuthorized(user)
            if (result) {
                return response.ok()
            }
            return response.unauthorized()
        } catch (e) {
            Logger.error(`Error during validation: ${e.message}`)
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Sse('sse')
    sse(): Observable<MessageEvent> {
        // Semd SSE event to user when canvas authentication is successful
        return fromEvent(this.eventEmitter, 'sse.event').pipe(
            map((payload) => ({
                data: JSON.stringify(payload),
            }))
        )
    }

    @Post('comment/announcement')
    async postAnnouncementComment(
        @Param('user_id') userId: string,
        @Param('course_id') courseId: string,
        @Param('discussion_topic_id') discussionTopicId: string,
        @Body('message') message: string
    ) {
        try {
            if (!message) {
                Logger.error('Message is empty')
                throw new Error()
            }

            const result = await this.service.sendAnnouncementComment(
                userId,
                courseId,
                discussionTopicId,
                message
            )
            if (!result) {
                Logger.error('Failed to post announcement comment')
                throw new Error()
            }
            return 'Submission comment posted successfully!'
        } catch (e) {
            Logger.error(`Error posting announcement comment: ${e.message}`)
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Post('courses/:course_id/assignments/:assignment_id/submissions/:user_id')
    async sendSubmissionComment(
        @Param('user_id') userId: string,
        @Param('course_id') courseId: string,
        @Param('assignment_id') assignmentId: string,
        @Body('message') message: string
    ) {
        try {
            if (!message || !userId) {
                Logger.error('Message or userId is empty')
                throw new Error()
            }

            const result = await this.service.sendSubmissionComment(
                userId,
                courseId,
                assignmentId,
                message
            )
            if (!result) {
                Logger.error('Failed to post submission comment')
                throw new Error()
            }
            return 'Submission comment posted successfully!'
        } catch (e) {
            Logger.error(`Error posting submission comment: ${e.message}`)
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }
}
