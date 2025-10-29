import { MiddlewareConsumer, Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { EduAdapterFactory } from './edu.factory'
import { GradeController } from './contoller/grade.controller'
import { RequestContext } from './request.context'
import { RequestContextMiddleware } from './request.middleware'
import { CanvasNotificationServiceModule } from 'src/notification/canvas/notificationservice.canvas.module'

@Module({
    imports: [CanvasNotificationServiceModule],
    controllers: [GradeController],
    providers: [PrismaService, EduAdapterFactory, RequestContext],
    exports: [],
})
export class EduModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes('*')
    }
}
