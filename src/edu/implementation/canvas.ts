import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Grades, IEduAdapter } from '../adapter'
import { CanvasNotificationService } from 'src/notification/canvas/notification.canvas.service'

export type CanvasConfig = {
    endpoint: string
    graphqlEndpoint: string
    notificationService: CanvasNotificationService
}

class CanvasAdapter implements IEduAdapter {
    endpoint: string
    graphqlEndpoint: string
    notificationService: CanvasNotificationService

    constructor({
        endpoint,
        graphqlEndpoint,
        notificationService,
    }: CanvasConfig) {
        if (!endpoint || !graphqlEndpoint) {
            throw new HttpException(
                'CanvasAdapter requires endpoint and token',
                HttpStatus.BAD_REQUEST
            )
        }
        this.endpoint = endpoint
        this.graphqlEndpoint = graphqlEndpoint
        this.notificationService = notificationService
    }

    private async fetchStudentToken(studentId: string): Promise<string> {
        const token = await this.notificationService.getCanvasToken(studentId)
        return JSON.parse(token).access_token
    }

    async getGrades(studentId: string, courseId?: string): Promise<Grades> {
        // graphql query fetches grades for all courses the user is assigned to
        const query = `
            query FetchGrades {
                allCourses {
                    courseCode
                    assignmentGroups {
                        name
                        assignmentsConnection {
                            edges {
                                node {
                                    name
                                    htmlUrl
                                    description
                                    totalGradedSubmissions
                                    totalSubmissions
                                    submissionsConnection {
                                        nodes {
                                            grade
                                            gradedAt
                                            score
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`

        try {
            const token = await this.fetchStudentToken(studentId)
            const response = await fetch(this.graphqlEndpoint, {
                method: 'POST',
                body: JSON.stringify({ query }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            const { data } = await response.json()

            if (!data || !data.allCourses) {
                Logger.error(
                    `Invalid response from Canvas for student ${studentId}: ${JSON.stringify(data)}`
                )
                throw new HttpException(
                    'Invalid response from Canvas',
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }

            const courses = data.allCourses
                .filter(
                    (course: any) => !courseId || course.courseCode === courseId
                )
                .map((course: any) => ({
                    id: course.courseCode,
                    name: course.courseCode,
                    description: '', // Canvas API does not provide course description in this query
                    grade: undefined, // Grade at course level not provided
                    work: (course.assignmentGroups || []).flatMap(
                        (group: any) =>
                            (group.assignmentsConnection?.edges || []).map(
                                (edge: any) => {
                                    const node = edge.node
                                    const submission =
                                        node.submissionsConnection?.nodes?.[0]
                                    return {
                                        id: node.htmlUrl,
                                        name: node.name,
                                        description: node.description || '',
                                        grade: submission?.grade ?? undefined,
                                        gradedAt: submission?.gradedAt || '',
                                    }
                                }
                            )
                    ),
                }))

            const grades: Grades = { courses }
            return grades
        } catch (error: any) {
            Logger.error(
                `Error fetching grades for student ${studentId}: ${error.message}`,
                error.stack
            )
            throw new HttpException(
                `Error fetching grades: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

export default CanvasAdapter
