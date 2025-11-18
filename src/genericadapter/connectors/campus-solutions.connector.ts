import { Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { BaseConnector } from './generic-adapter.connector'

@Injectable()
export class CampusSolutionsConnector extends BaseConnector {
    readonly vendor = 'campus_solutions'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = this.getPreviewPayload(preview)

        switch (response.internalName) {
            case 'campus_solutions_schedule':
                return {
                    type: 'schedule',
                    title: payload.title ?? payload.courseTitle ?? '',
                    startAt: payload.startAt ?? payload.start_time ?? null,
                    endAt: payload.endAt ?? payload.end_time ?? null,
                    location: payload.location ?? payload.room ?? null,
                }
            case 'campus_solutions_grade':
                return {
                    type: 'grade',
                    courseId: payload.courseId ?? payload.course_id ?? null,
                    grade: payload.grade ?? payload.score ?? null,
                    term: payload.term ?? payload.termName ?? null,
                }
            default:
                return payload
        }
    }
}
