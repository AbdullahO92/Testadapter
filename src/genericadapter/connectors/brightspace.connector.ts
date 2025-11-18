import { Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { BaseConnector } from './generic-adapter.connector'

@Injectable()
export class BrightspaceConnector extends BaseConnector {
    readonly vendor = 'brightspace'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = this.getPreviewPayload(preview)

        switch (response.internalName) {
            case 'brightspace_announcement':
                return {
                    type: 'announcement',
                    title: payload.Title ?? payload.title ?? '',
                    message:
                        payload.Body?.Html ?? payload.message ?? payload.Body ?? '',
                    courseId:
                        payload.OrgUnitId ?? payload.course_id ?? payload.courseId ?? null,
                    publishedAt:
                        payload.StartDate ?? payload.published_at ?? payload.publishedAt ?? null,
                }
            case 'brightspace_grade':
                return {
                    type: 'grade',
                    assignmentName:
                        payload.GradeObjectName ?? payload.assignment_name ?? '',
                    grade: payload.Grade ?? payload.grade ?? null,
                    assessor:
                        payload.AssessedBy ?? payload.assessor ?? payload.assessor_feedback ?? null,
                    courseId:
                        payload.OrgUnitId ?? payload.course_id ?? payload.courseId ?? null,
                }
            default:
                return payload
        }
    }
}
