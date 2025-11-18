import { Injectable } from '@nestjs/common'

import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class CampusSolutionsNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'campus_solutions_schedule_change',
        'campus_solutions_grade_posted',
        'campus_solutions_financial_hold',
        'campus_solutions_enrollment_deadline',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'campus_solutions_schedule_change':
                return this.translateScheduleChange(user.id, body)
            case 'campus_solutions_grade_posted':
                return this.translateGradePosted(user.id, body)
            case 'campus_solutions_financial_hold':
                return this.translateFinancialHold(user.id, body)
            case 'campus_solutions_enrollment_deadline':
                return this.translateEnrollmentDeadline(user.id, body)
            default:
                return null
        }
    }

    private translateScheduleChange(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 9, null, {
            course_code: body.courseCode ?? '',
            course_title: body.courseTitle ?? '',
            change_type: body.changeType ?? '',
            effective_date: body.effectiveDate ?? null,
            location: body.location ?? null,
            instructor: body.instructor ?? null,
        })
    }

    private translateGradePosted(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 10, null, {
            course_code: body.courseCode ?? '',
            course_title: body.courseTitle ?? '',
            term: body.term ?? null,
            grade: body.grade ?? '',
            graded_at: body.gradedAt ?? null,
        })
    }

    private translateFinancialHold(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 11, null, {
            hold_type: body.holdType ?? '',
            reason: body.reason ?? null,
            effective_date: body.effectiveDate ?? null,
            contact: body.contact ?? null,
        })
    }

    private translateEnrollmentDeadline(
        userId: string,
        body: any
    ): NotificationDto {
        return new NotificationDto(userId, 12, null, {
            term: body.term ?? null,
            deadline_name: body.deadlineName ?? '',
            deadline_date: body.deadlineDate ?? null,
            instructions: body.instructions ?? null,
        })
    }
}
