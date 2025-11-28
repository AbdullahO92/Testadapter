import { BadRequestException, Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/genericadapter-preview.dto'
import { BaseConnector } from './genericadapter.connector'

@Injectable()
export class CanvasConnector extends BaseConnector {
    readonly vendor = 'canvas'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = this.getPreviewPayload(preview)

        this.validatePayload(response.internalName, payload)

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

    private validatePayload(
        internalName: string,
        payload: Record<string, any>
    ): void {
        if (!payload || typeof payload !== 'object') {
            throw new BadRequestException(
                'Canvas payload must be an object with the expected fields.'
            )
        }

        const requirements = this.requiredFields[internalName]
        if (!requirements) {
            return
        }

        const missing = requirements.filter((aliases) =>
            !aliases.some((field) => this.hasValue(payload[field]))
        )

        if (missing.length) {
            const names = missing.map((aliases) => aliases[0]).join(', ')
            throw new BadRequestException(
                `Canvas payload is missing required field(s): ${names}.`
            )
        }
    }

    private hasValue(value: unknown): boolean {
        if (value === null || value === undefined) {
            return false
        }

        if (typeof value === 'string') {
            return value.trim().length > 0
        }

        return true
    }

    private readonly requiredFields: Record<string, string[][]> = {
        canvas_announcement: [
            ['title', 'announcement_title'],
            ['message', 'announcement_message'],
            ['course_id', 'courseId'],
        ],
        canvas_grade: [
            ['assignment_name', 'assignmentName'],
            ['grade'],
            ['course_id', 'courseId'],
        ],
        canvas_submission_reminder: [
            ['assignment_name', 'assignmentName'],
            ['due_at', 'dueAt'],
            ['course_id', 'courseId'],
        ],
        canvas_submission_comment: [
            ['comment', 'feedback_details'],
            ['author_name', 'assessor_full_name'],
            ['course_id', 'courseId'],
        ],
        canvas_welcome: [],
    }
}