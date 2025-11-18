import { Injectable } from '@nestjs/common'
import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class CanvasNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'canvas_announcement',
        'canvas_grade',
        'canvas_submission_reminder',
        'canvas_submission_comment',
        'canvas_welcome',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'canvas_announcement':
                return this.translateAnnouncement(user.id, body)
            case 'canvas_grade':
                return this.translateGrade(user.id, body)
            case 'canvas_submission_reminder':
                return this.translateSubmissionReminder(user.id, body)
            case 'canvas_submission_comment':
                return this.translateSubmissionComment(user.id, body)
            case 'canvas_welcome':
                return this.translateCanvasWelcome(user.id)
            default:
                return null
        }
    }

    private translateAnnouncement(userId: string, body: any): NotificationDto {
        const eventId = 3
        const message = this.cleanHtml(
            body.message ?? body.announcement_message ?? ''
        )

        return new NotificationDto(userId, eventId, null, {
            announcement_title: body.title ?? body.announcement_title ?? '',
            announcement_message: message,
            course_id: body.course_id ?? body.courseId ?? null,
            announcement_id: body.announcement_id ?? null,
        })
    }

    private translateSubmissionReminder(
        userId: string,
        body: any
    ): NotificationDto {
        const eventId = 7
        const dueAt = body.due_at ?? body.dueAt ?? null

        return new NotificationDto(userId, eventId, null, {
            course_name: body.course_name ?? null,
            assignment_name: body.assignment_name ?? body.assignmentName ?? '',
            due_at: dueAt ? new Date(dueAt).toTimeString().substring(0, 5) : null,
            course_id: body.course_id ?? body.courseId ?? null,
            assignment_id: body.assignment_id ?? body.assignmentId ?? null,
        })
    }

    private translateSubmissionComment(
        userId: string,
        body: any
    ): NotificationDto {
        const eventId = 2
        const dueDate = body.due_at ?? body.dueAt ?? null
        const correctedDueDate = dueDate
            ? new Date(new Date(dueDate).setHours(new Date(dueDate).getHours() - 8))
            : null

        return new NotificationDto(userId, eventId, null, {
            id: body.id ?? null,
            user_id: userId,
            assessor_full_name: body.author_name ?? body.assessor_full_name ?? '',
            feedback_text: 'Received comment:',
            feedback_details: body.comment ?? body.feedback_details ?? '',
            submission_id: body.submission_id ?? null,
            course_name: body.course_name ?? null,
            assignment_title:
                body.assignment_name ?? body.assignment_title ?? '',
            due_at: correctedDueDate
                ? correctedDueDate.toTimeString().substring(0, 5)
                : null,
            course_id: body.course_id ?? body.courseId ?? null,
            assignment_id: body.assignment_id ?? body.assignmentId ?? null,
        })
    }

    private translateGrade(userId: string, body: any): NotificationDto {
        const eventId = 1
        const defaultFeedback = 'No comment was left by the assessor.'

        return new NotificationDto(userId, eventId, null, {
            assignment_name: body.assignment_name ?? body.assignmentName ?? '',
            grade: body.grade ?? null,
            assessor_feedback:
                body.assessor_feedback ?? body.assessor ?? defaultFeedback,
            course_id: body.course_id ?? body.courseId ?? null,
            assignment_id: body.assignment_id ?? body.assignmentId ?? null,
        })
    }

    private translateCanvasWelcome(userId: string): NotificationDto {
        return new NotificationDto(userId, 8, null, {})
    }

    private cleanHtml(message: string): string {
        return message
            .replaceAll('<p>', '')
            .replaceAll('</p>', '')
            .replaceAll('<span>', '')
            .replaceAll('</span>', '')
            .replaceAll('<div>', '')
            .replaceAll('</div>', '')
    }
}
