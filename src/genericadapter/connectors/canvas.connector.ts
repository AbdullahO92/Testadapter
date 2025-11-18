import { Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { BaseConnector } from './generic-adapter.connector'

@Injectable()
export class CanvasConnector extends BaseConnector {
    readonly vendor = 'canvas'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = this.getPreviewPayload(preview)

        switch (response.internalName) {
            case 'canvas_announcement':
                return {
                    type: 'announcement',
                    title: payload.title ?? payload.announcement_title ?? '',
                    message: payload.message ?? payload.announcement_message ?? '',
                    courseId: payload.course_id ?? payload.courseId ?? null,
                    publishedAt: payload.published_at ?? payload.publishedAt ?? null,
                }
            case 'canvas_grade':
                return {
                    type: 'grade',
                    assignmentName:
                        payload.assignment_name ?? payload.assignmentName ?? '',
                    grade: payload.grade ?? null,
                    assessor:
                        payload.assessor_feedback ?? payload.assessorFeedback ?? null,
                    courseId: payload.course_id ?? payload.courseId ?? null,
                }
            case 'canvas_submission_reminder':
                return {
                    type: 'reminder',
                    assignmentName:
                        payload.assignment_name ?? payload.assignmentName ?? '',
                    dueAt: payload.due_at ?? payload.dueAt ?? null,
                    courseId: payload.course_id ?? payload.courseId ?? null,
                }
            case 'canvas_submission_comment':
                return {
                    type: 'feedback',
                    comment: payload.comment ?? payload.feedback_details ?? '',
                    assessor: payload.author_name ?? payload.assessor_full_name ?? '',
                    courseId: payload.course_id ?? payload.courseId ?? null,
                    assignmentId:
                        payload.assignment_id ?? payload.assignmentId ?? null,
                }
            case 'canvas_welcome':
                return {
                    type: 'welcome',
                    message:
                        payload.welcome_message ??
                        payload.message ??
                        'Welcome to Canvas!',
                }
            default:
                return payload
        }
    }
}
