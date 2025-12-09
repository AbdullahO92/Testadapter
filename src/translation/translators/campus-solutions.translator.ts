import { Injectable } from '@nestjs/common'

import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class CampusSolutionsNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = [
        'campus_solutions_results',
        'campus_solutions_filteredresults',
        'campus_solutions_courseresults',
        'campus_solutions_collegekaart',
        'campus_solutions_faciliteiten',
        'campus_solutions_pasfoto',
        'campus_solutions_classes',
        'campus_solutions_programs',
        'campus_solutions_allcourseresults',
        'campus_solutions_resultsderegisteredstudents',
    ]

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        switch (response.internalName) {
            case 'campus_solutions_results':
                return this.translateResults(user.id, body)
            case 'campus_solutions_filteredresults':
                return this.translateFilteredResults(user.id, body)
            case 'campus_solutions_courseresults':
                return this.translateCourseResults(user.id, body)
            case 'campus_solutions_collegekaart':
                return this.translateCollegekaart(user.id, body)
            case 'campus_solutions_faciliteiten':
                return this.translateFaciliteiten(user.id, body)
            case 'campus_solutions_pasfoto':
                return this.translatePasfoto(user.id, body)
            case 'campus_solutions_classes':
                return this.translateClasses(user.id, body)
            case 'campus_solutions_programs':
                return this.translatePrograms(user.id, body)
            case 'campus_solutions_allcourseresults':
                return this.translateAllCourseResults(user.id, body)
            case 'campus_solutions_resultsderegisteredstudents':
                return this.translateResultsDeregisteredStudents(user.id, body)
            default:
                return null
        }
    }

    private translateResults(userId: string, body: any): NotificationDto {
        const results = Array.isArray(body.results) ? body.results : []

        return new NotificationDto(userId, 13, null, {
            title: 'Results',
            include_inactive_apt: Boolean(body.includeInactiveApt),
            total_results: results.length,
            results,
        })
    }

    private translateFilteredResults(
        userId: string,
        body: any
    ): NotificationDto {
        const groupResults = Array.isArray(body.groupResults)
            ? body.groupResults
            : []

        return new NotificationDto(userId, 14, null, {
            title: 'Filtered results',
            include_inactive_apt: Boolean(body.includeInactiveApt),
            group_results: groupResults,
        })
    }

    private translateCourseResults(userId: string, body: any): NotificationDto {
        const apts = Array.isArray(body.apts) ? body.apts : []

        return new NotificationDto(userId, 15, null, {
            include_inactive_apt: Boolean(body.includeInactiveApt),
            apts,
        })
    }

    private translateCollegekaart(userId: string, body: any): NotificationDto {
        const collegekaart = body.collegekaart ?? {}

        return new NotificationDto(userId, 16, null, {
            card: collegekaart,
        })
    }

    private translateFaciliteiten(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 17, null, {
            facility_name: body.facilityName ?? '',
            status: body.status ?? '',
            location: body.location ?? null,
            updated_at: body.updatedAt ?? null,
        })
    }

    private translatePasfoto(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 18, null, {
            photo_url: body.photoUrl ?? '',
            updated_at: body.updatedAt ?? null,
            note: body.note ?? null,
        })
    }

    private translateClasses(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 19, null, {
            class_name: body.className ?? '',
            class_number: body.classNumber ?? null,
            schedule: body.schedule ?? null,
            room: body.room ?? null,
        })
    }

    private translatePrograms(userId: string, body: any): NotificationDto {
        return new NotificationDto(userId, 20, null, {
            program_name: body.programName ?? '',
            status: body.status ?? '',
            start_date: body.startDate ?? null,
            expected_graduation: body.expectedGraduation ?? null,
        })
    }

    private translateAllCourseResults(
        userId: string,
        body: any
    ): NotificationDto {
        return new NotificationDto(userId, 21, null, {
            total_courses: body.totalCourses ?? 0,
            completed_courses: body.completedCourses ?? 0,
            gpa: body.gpa ?? null,
            last_updated: body.lastUpdated ?? null,
        })
    }

    private translateResultsDeregisteredStudents(
        userId: string,
        body: any
    ): NotificationDto {
        return new NotificationDto(userId, 22, null, {
            deregistered_since: body.deregisteredSince ?? null,
            student_count: body.studentCount ?? 0,
            note: body.note ?? null,
        })
    }
}