import { Injectable } from '@nestjs/common'
import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class BrightspaceNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'brightspace_announcement',
        'brightspace_grade',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'brightspace_announcement':
                return this.translateAnnouncement(user.id, body)
            case 'brightspace_grade':
                return this.translateGrade(user.id, body)
            default:
                return null
        }
    }

    private translateAnnouncement(userId: string, body: any): NotificationDto {
        const eventId = 3
        return new NotificationDto(userId, eventId, null, {
            announcement_title: body.title ?? body.Title ?? '',
            announcement_message:
                body.message ?? body.Body?.Html ?? body.Body ?? '',
            course_id: body.courseId ?? body.OrgUnitId ?? null,
            published_at:
                body.publishedAt ?? body.StartDate ?? body.EndDate ?? null,
        })
    }

    private translateGrade(userId: string, body: any): NotificationDto {
        const eventId = 1
        return new NotificationDto(userId, eventId, null, {
            assignment_name: body.assignmentName ?? body.GradeObjectName ?? '',
            grade: body.grade ?? body.Grade ?? null,
            assessor_feedback:
                body.assessor ?? body.AssessedBy ?? body.AssessmentFeedback ?? null,
            course_id: body.courseId ?? body.OrgUnitId ?? null,
        })
    }
}
