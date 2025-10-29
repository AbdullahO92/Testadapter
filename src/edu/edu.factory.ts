import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import PSCSAdapter from './implementation/pscs'
import CanvasAdapter from './implementation/canvas'
import { Grades, IEduAdapter } from './adapter'
import { RequestContext } from './request.context'
import { CanvasNotificationService } from '../notification/canvas/notification.canvas.service'

enum EduSource {
    CANVAS = 'CANVAS',
    PSCS = 'PSCS', // peoplesoft campus solution
}

@Injectable()
export class EduAdapterFactory implements IEduAdapter {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly requestContext: RequestContext,
        private readonly notificationService: CanvasNotificationService // Assuming NotificationService is defined elsewhere
    ) {}

    async eduSourceMapper(): Promise<EduSource> {
        const req = this.requestContext.getRequest()
        const { headers } = req
        let { 'x-edu-source': source } = headers

        if (Array.isArray(source)) {
            source = source[0]
        }
        source = source?.toUpperCase()

        if (source === EduSource.CANVAS) {
            return EduSource.CANVAS
        } else if (source === EduSource.PSCS) {
            return EduSource.PSCS
        }

        throw new Error('x-edu-source header is not set or invalid')
    }

    async getEduAdapter(): Promise<IEduAdapter> {
        const source = await this.eduSourceMapper()
        switch (source) {
            case EduSource.CANVAS:
                // TODO: pass user token
                return new CanvasAdapter({
                    endpoint: 'https://canvas.cy2.com/api/v1',
                    graphqlEndpoint: 'https://canvas.cy2.com/api/graphql',
                    notificationService: this.notificationService, // Assuming NotificationService is defined elsewhere
                })
            case EduSource.PSCS:
                // pass arg to PSCS adapter to switch implementation per institute or switch adapter
                return new PSCSAdapter()
            default:
                throw new Error('Invalid data source')
        }
    }

    async getGrades(studentId: string, courseId: string): Promise<Grades> {
        const adapter = await this.getEduAdapter()
        return adapter.getGrades(studentId, courseId)
    }
}
