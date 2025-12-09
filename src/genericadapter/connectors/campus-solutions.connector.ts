import { BadRequestException, Injectable } from '@nestjs/common'

import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/genericadapter-preview.dto'
import { BaseConnector } from './genericadapter.connector'

type CampusSolutionsPayload = Record<string, any>
type Normalizer = (payload: CampusSolutionsPayload) => Record<string, any>


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
            case 'campus_solutions_results':
                return {
                    type: 'results',
                    resultsTitle: payload.resultsTitle,
                    summary: payload.summary ?? null,
                    issuedDate: payload.issuedDate ?? null,
                }
            case 'campus_solutions_filteredresults':
                return {
                    type: 'filtered_results',
                    filter: payload.filter ?? null,
                    resultsTitle: payload.resultsTitle,
                    summary: payload.summary ?? null,
                    issuedDate: payload.issuedDate ?? null,
                }
            case 'campus_solutions_courseresults':
                return {
                    type: 'course_results',
                    courseCode: payload.courseCode,
                    courseTitle: payload.courseTitle,
                    result: payload.result,
                    gradedAt: payload.gradedAt ?? null,
                }
            case 'campus_solutions_collegekaart':
                return {
                    type: 'college_card',
                    cardNumber: payload.cardNumber,
                    status: payload.status,
                    issuedDate: payload.issuedDate ?? null,
                    expiresOn: payload.expiresOn ?? null,
                }
            case 'campus_solutions_faciliteiten':
                return {
                    type: 'facilities',
                    facilityName: payload.facilityName,
                    status: payload.status,
                    location: payload.location ?? null,
                    updatedAt: payload.updatedAt ?? null,
                }
            case 'campus_solutions_pasfoto':
                return {
                    type: 'pasfoto',
                    photoUrl: payload.photoUrl,
                    updatedAt: payload.updatedAt ?? null,
                    note: payload.note ?? null,
                }
            case 'campus_solutions_classes':
                return {
                    type: 'classes',
                    className: payload.className,
                    classNumber: payload.classNumber ?? null,
                    schedule: payload.schedule ?? null,
                    room: payload.room ?? null,
                }
            case 'campus_solutions_programs':
                return {
                    type: 'programs',
                    programName: payload.programName,
                    status: payload.status,
                    startDate: payload.startDate ?? null,
                    expectedGraduation: payload.expectedGraduation ?? null,
                }
            case 'campus_solutions_allcourseresults':
                return {
                    type: 'all_course_results',
                    totalCourses: payload.totalCourses,
                    completedCourses: payload.completedCourses,
                    gpa: payload.gpa ?? null,
                    lastUpdated: payload.lastUpdated ?? null,
                }
            case 'campus_solutions_resultsderegisteredstudents':
                return {
                    type: 'results_deregistered_students',
                    deregisteredSince: payload.deregisteredSince ?? null,
                    studentCount: payload.studentCount,
                    note: payload.note ?? null,
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
        campus_solutions_results: [['resultsTitle']],
        campus_solutions_filteredresults: [['resultsTitle']],
        campus_solutions_courseresults: [
            ['courseCode'],
            ['courseTitle'],
            ['result'],
        ],
        campus_solutions_collegekaart: [
            ['cardNumber'],
            ['status'],
        ],
        campus_solutions_faciliteiten: [
            ['facilityName'],
            ['status'],
        ],
        campus_solutions_pasfoto: [['photoUrl']],
        campus_solutions_classes: [['className']],
        campus_solutions_programs: [
            ['programName'],
            ['status'],
        ],
        campus_solutions_allcourseresults: [
            ['totalCourses'],
            ['completedCourses'],
        ],
        campus_solutions_resultsderegisteredstudents: [
            ['studentCount'],
        ],
    }

    private readonly mockPayloads: Record<string, CampusSolutionsPayload> = {

        campus_solutions_results: {
            resultsTitle: 'Latest examination results',
            issuedDate: new Date().toISOString(),
            summary: 'Mock GPA available with detailed course scores.',
        },
        campus_solutions_filteredresults: {
            filter: 'Current term',
            resultsTitle: 'Filtered results',
            issuedDate: new Date().toISOString(),
            summary: 'Only courses from the active term are shown.',
        },
        campus_solutions_courseresults: {
            courseCode: 'BIO150',
            courseTitle: 'General Biology',
            result: 'B+',
            gradedAt: new Date().toISOString(),
        },
        campus_solutions_collegekaart: {
            cardNumber: 'CC-2025-1234',
            status: 'Active',
            issuedDate: new Date().toISOString(),
            expiresOn: new Date(Date.now() + 365 * 86400000).toISOString(),
        },
        campus_solutions_faciliteiten: {
            facilityName: 'Library',
            status: 'Open',
            location: 'Main campus',
            updatedAt: new Date().toISOString(),
        },
        campus_solutions_pasfoto: {
            photoUrl: 'https://campus-solutions.test/images/pasfoto.jpg',
            updatedAt: new Date().toISOString(),
            note: 'Mock student photo on file.',
        },
        campus_solutions_classes: {
            className: 'Data Structures',
            classNumber: 'CS220',
            schedule: 'Mon/Wed 10:00 - 11:30',
            room: 'Building B, Room 101',
        },
        campus_solutions_programs: {
            programName: 'Bachelor of Science in Computer Science',
            status: 'Active',
            startDate: new Date().toISOString(),
            expectedGraduation: new Date(
                Date.now() + 2 * 365 * 86400000
            ).toISOString(),
        },
        campus_solutions_allcourseresults: {
            totalCourses: 8,
            completedCourses: 6,
            gpa: 3.6,
            lastUpdated: new Date().toISOString(),
        },
        campus_solutions_resultsderegisteredstudents: {
            deregisteredSince: '2025-01-01',
            studentCount: 2,
            note: 'Mock list of deregistered students with recent results.',
        },
    }
}