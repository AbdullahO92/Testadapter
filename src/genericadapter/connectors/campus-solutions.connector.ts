import { BadRequestException, Injectable } from '@nestjs/common'

import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { BaseConnector } from './generic-adapter.connector'
import {
    CampusSolutionsMockPayloads,
    createCampusSolutionsMockPayloads,
} from './campus-solutions.mock'

type CampusSolutionsPayload = Record<string, any>

@Injectable()
export class CampusSolutionsConnector extends BaseConnector {
    readonly vendor = 'campus-solutions'

    protected async normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const fallback = this.mockPayloads[response.internalName] ?? {}
        const payload: CampusSolutionsPayload = {
            ...fallback,
            ...this.getPreviewPayload(preview),
        }

        this.validatePayload(response.internalName, payload)

        switch (response.internalName) {
            case 'campus_solutions_schedule_change':
                return {
                    type: 'schedule_change',
                    courseCode: payload.courseCode,
                    courseTitle: payload.courseTitle,
                    changeType: payload.changeType,
                    effectiveDate: payload.effectiveDate,
                    location: payload.location ?? null,
                    instructor: payload.instructor ?? null,
                }
            case 'campus_solutions_grade_posted':
                return {
                    type: 'grade_posted',
                    courseCode: payload.courseCode,
                    courseTitle: payload.courseTitle,
                    term: payload.term ?? null,
                    grade: payload.grade,
                    gradedAt: payload.gradedAt ?? null,
                }
            case 'campus_solutions_financial_hold':
                return {
                    type: 'financial_hold',
                    holdType: payload.holdType,
                    reason: payload.reason ?? null,
                    effectiveDate: payload.effectiveDate,
                    contact: payload.contact ?? null,
                }
            case 'campus_solutions_enrollment_deadline':
                return {
                    type: 'enrollment_deadline',
                    term: payload.term ?? null,
                    deadlineName: payload.deadlineName,
                    deadlineDate: payload.deadlineDate,
                    instructions: payload.instructions ?? null,
                }
            default:
                return payload
        }
    }

    private validatePayload(
        internalName: string,
        payload: CampusSolutionsPayload
    ): void {
        if (!payload || typeof payload !== 'object') {
            throw new BadRequestException(
                'Campus Solutions payload must be an object with the expected fields.'
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
                `Campus Solutions payload is missing required field(s): ${names}.`
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
        campus_solutions_schedule_change: [
            ['courseCode'],
            ['courseTitle'],
            ['changeType'],
            ['effectiveDate'],
        ],
        campus_solutions_grade_posted: [
            ['courseCode'],
            ['courseTitle'],
            ['grade'],
        ],
        campus_solutions_financial_hold: [
            ['holdType'],
            ['effectiveDate'],
        ],
        campus_solutions_enrollment_deadline: [
            ['deadlineName'],
            ['deadlineDate'],
        ],
    }

    private readonly mockPayloads: CampusSolutionsMockPayloads =
        createCampusSolutionsMockPayloads()
}
