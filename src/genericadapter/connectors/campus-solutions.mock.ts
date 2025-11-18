export type CampusSolutionsMockPayload = Record<string, any>

export type CampusSolutionsMockPayloads = Record<
    string,
    CampusSolutionsMockPayload
>

export function createCampusSolutionsMockPayloads(): CampusSolutionsMockPayloads {
    const now = new Date()

    return {
        campus_solutions_schedule_change: {
            courseCode: 'CS101',
            courseTitle: 'Introduction to Programming',
            changeType: 'Room change',
            effectiveDate: now.toISOString(),
            location: 'Building A, Room 204',
            instructor: 'Dr. Patel',
        },
        campus_solutions_grade_posted: {
            courseCode: 'FIN201',
            courseTitle: 'Financial Accounting',
            term: 'Fall 2025',
            grade: 'A-',
            gradedAt: now.toISOString(),
        },
        campus_solutions_financial_hold: {
            holdType: 'Financial hold',
            reason: 'Outstanding balance exceeds limit',
            effectiveDate: now.toISOString(),
            contact: 'Contact Student Finance Office',
        },
        campus_solutions_enrollment_deadline: {
            term: 'Spring 2026',
            deadlineName: 'Course registration deadline',
            deadlineDate: new Date(now.getTime() + 7 * 86400000).toISOString(),
            instructions: 'Review your study plan and submit any overrides.',
        },
    }
}
