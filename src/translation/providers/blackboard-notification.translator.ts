import { Injectable } from '@nestjs/common'
import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class BlackboardNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'blackboard_announcement',
        'blackboard_grade',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'blackboard_announcement':
                return this.translateAnnouncement(user.id, body)
            case 'blackboard_grade':
                return this.translateGrade(user.id, body)
            default:
                return null
        }
    }

    private translateAnnouncement(userId: string, body: any): NotificationDto {
        const eventId = 3
        return new NotificationDto(userId, eventId, null, {
            announcement_title: body.title ?? '',
            announcement_message: body.message ?? '',
            course_id: body.courseId ?? null,
            published_at: body.publishedAt ?? null,
        })
    }

    private translateGrade(userId: string, body: any): NotificationDto {
        const eventId = 1
        return new NotificationDto(userId, eventId, null, {
            assignment_name: body.assignmentName ?? '',
            grade: body.grade ?? null,
            assessor_feedback: body.assessor ?? null,
            course_id: body.courseId ?? null,
        })
    }
}
