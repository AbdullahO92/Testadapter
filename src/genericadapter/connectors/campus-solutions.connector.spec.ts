import { BadRequestException } from '@nestjs/common'

import { CampusSolutionsConnector } from './campus-solutions.connector'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'

describe('CampusSolutionsConnector', () => {
    const connector = new CampusSolutionsConnector()

    function createResponse(internalName: string) {
        return new ExternalSystemResponseDto({
            id: `${internalName}-id`,
            externalSystemId: 'campus-system',
            internalName,
            displayName: internalName,
            description: null,
        } as any)
    }

    function createPreview(payload?: Record<string, any>) {
        const dto = new GenericAdapterPreviewDto()
        dto.userId = 'user-id'
        dto.responseInternalName = 'campus_solutions_schedule_change'
        dto.payload = payload
        return dto
    }

    it('normalizes schedule change payloads', async () => {
        const response = createResponse('campus_solutions_schedule_change')
        const preview = createPreview({
            courseCode: 'MATH101',
            courseTitle: 'Calculus I',
            changeType: 'Instructor change',
            effectiveDate: '2025-03-10T09:00:00.000Z',
            location: 'Hall 5',
            instructor: 'Dr. Smith',
        })

        const normalized = await connector.buildPayload(preview, response)

        expect(normalized).toEqual({
            type: 'schedule_change',
            courseCode: 'MATH101',
            courseTitle: 'Calculus I',
            changeType: 'Instructor change',
            effectiveDate: '2025-03-10T09:00:00.000Z',
            location: 'Hall 5',
            instructor: 'Dr. Smith',
        })
    })

    it('uses mock data when payload is not provided', async () => {
        const response = createResponse('campus_solutions_grade_posted')
        const preview = createPreview()
        preview.responseInternalName = 'campus_solutions_grade_posted'
        preview.payload = undefined

        const normalized = await connector.buildPayload(preview, response)

        expect(normalized.type).toBe('grade_posted')
        expect(normalized.courseCode).toBeDefined()
        expect(normalized.courseTitle).toBeDefined()
        expect(normalized.grade).toBeDefined()
    })

    it('throws when a required field is empty', async () => {
        const response = createResponse('campus_solutions_financial_hold')
        const preview = createPreview({
            holdType: 'Financial hold',
            effectiveDate: '',
        })
        preview.responseInternalName = 'campus_solutions_financial_hold'

        await expect(connector.buildPayload(preview, response)).rejects.toBeInstanceOf(
            BadRequestException
        )
    })
})
