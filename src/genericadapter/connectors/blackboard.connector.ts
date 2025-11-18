import { Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { BaseConnector } from './generic-adapter.connector'

@Injectable()
export class BlackboardConnector extends BaseConnector {
    readonly vendor = 'blackboard'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = this.getPreviewPayload(preview)

        switch (response.internalName) {
            case 'blackboard_announcement':
                return {
                    type: 'announcement',
                    title: payload.title ?? payload.subject ?? '',
                    message: payload.body ?? payload.message ?? '',
                    courseId:
                        payload.courseId ?? payload.course_id ?? payload.orgUnitId ?? null,
                    publishedAt:
                        payload.created ?? payload.published_at ?? payload.publishOn ?? null,
                }
            case 'blackboard_grade':
                return {
                    type: 'grade',
                    assignmentName:
                        payload.columnName ?? payload.assignment_name ?? '',
                    grade:
                        payload.score ?? payload.grade ?? payload.overallScore ?? null,
                    courseId:
                        payload.courseId ?? payload.course_id ?? payload.orgUnitId ?? null,
                    assessor:
                        payload.evaluatedBy ?? payload.assessor ?? payload.grader ?? null,
                }
            default:
                return payload
        }
    }
}
