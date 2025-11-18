import { Injectable } from '@nestjs/common'
import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class CampusSolutionsNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'campus_solutions_schedule',
        'campus_solutions_grade',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'campus_solutions_schedule':
                return this.translateSchedule(user.id, body)
            case 'campus_solutions_grade':
                return this.translateGrade(user.id, body)
            default:
                return null
        }
    }

    private translateSchedule(userId: string, body: any): NotificationDto {
        const eventId = 6
        return new NotificationDto(userId, eventId, null, {
            title: body.title ?? '',
            start_at: body.startAt ?? null,
            end_at: body.endAt ?? null,
            location: body.location ?? null,
        })
    }

    private translateGrade(userId: string, body: any): NotificationDto {
        const eventId = 1
        return new NotificationDto(userId, eventId, null, {
            course_id: body.courseId ?? null,
            grade: body.grade ?? null,
            term: body.term ?? null,
        })
    }
}
