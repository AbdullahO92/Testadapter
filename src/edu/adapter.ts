export type StudentInfo = {
    id: string
}

export type CourseInfo = {
    id: string
    courses: {
        id: string
        name: string
    }[]
}

export type Grades = {
    courses: {
        id?: string
        name?: string
        description?: string
        grade?: string
        work?: {
            id?: string
            name?: string
            description?: string
            grade?: string
        }[]
    }[]
}

export interface IEduAdapter {
    /*
     * Get student grades for a specific course
     * @param studentId - The ID of the student
     * @param courseId - The ID of the course (optional, if not provided, all grades for the student will be returned)
     * @returns A promise that resolves to the student's grades for the course
     */
    getGrades(studentId: string, courseId?: string): Promise<Grades>
}
