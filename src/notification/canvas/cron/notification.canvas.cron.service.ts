import { Injectable, Logger } from '@nestjs/common'
import { CanvasNotificationService } from '../notification.canvas.service'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CanvasCronNotificationService extends CanvasNotificationService {
    async getNotificationSubscribers(
        responseName: string
    ): Promise<[string, string, string, string][] | null> {
        const configurations = await this.getConfigurations()
        if (!configurations) return

        const validatedSubscribers: [string, string, string, string][] = []
        for (const configuration of configurations) {
            const eventMapping = await this.getEventMapping(
                configuration,
                this.externalSystemName,
                responseName
            )
            if (!eventMapping) continue

            const host = await this.getConfigurationHost(configuration)
            if (!host) continue

            const subscribers = await this.getSubscribers(
                configuration,
                eventMapping
            )
            if (!subscribers) continue

            for (const subscriber of subscribers) {
                const token = await this.tokenHandler.getToken(
                    subscriber,
                    configuration
                )
                if (!token) continue
                validatedSubscribers.push([
                    host,
                    eventMapping,
                    subscriber,
                    token,
                ])
            }
        }
        return validatedSubscribers
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollAnnouncements() {
        const subscribers = await this.getNotificationSubscribers(
            'canvas_announcement'
        )
        if (!subscribers) return

        for (const subscriber of subscribers) {
            const accessToken = await this.getAccessToken(subscriber[3])
            if (!accessToken) continue

            const courses = await this.getCourses(subscriber[0], accessToken)
            if (!courses) continue

            for (const course of courses) {
                const courseId = course['id']
                if (!courseId) continue

                const announcements = await this.getAnnouncements(
                    subscriber[0],
                    accessToken,
                    courseId
                )
                if (!announcements) continue

                for (const announcement of announcements) {
                    await this.sendNotification(
                        subscriber[2],
                        subscriber[1],
                        `states:${this.externalSystemName}:externalIdentities:${subscriber[1]}:announcements:${announcement['id']}`,
                        {
                            announcement_id: announcement['id'],
                            title: announcement['title'],
                            message: announcement['message'],
                            allow_rating: announcement['allow_rating'],
                            locked: announcement['locked'],
                            course_id: course['id'],
                            course_name: course['name'],
                        }
                    )
                }
            }
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollGrades() {
        const subscribers =
            await this.getNotificationSubscribers('canvas_grade')
        if (!subscribers) return

        for (const subscriber of subscribers) {
            const accessToken = await this.getAccessToken(subscriber[3])
            if (!accessToken) continue

            const parsedAccessToken = JSON.parse(subscriber[3])
            const user = parsedAccessToken['user']
            if (!user) return
            const userId = user['id']
            if (!userId) return

            const courses = await this.getCourses(subscriber[0], accessToken)
            if (!courses) continue

            for (const course of courses) {
                const courseId = course['id']
                if (!courseId) continue

                const submissions = await this.getGradedSubmissions(
                    subscriber[0],
                    accessToken,
                    courseId,
                    userId
                )
                if (!submissions) continue

                for (const submission of submissions) {
                    await this.sendNotification(
                        subscriber[2],
                        subscriber[1],
                        `states:${this.externalSystemName}:externalIdentities:${subscriber[1]}:grades:${submission['id']}`,
                        {
                            id: submission['id'],
                            grade: submission['grade'],
                            assessor_feedback: null,
                            assignment_id: submission.assignment['id'],
                            assignment_name: submission.assignment['name'],
                            course_id: course['id'],
                            course_name: course['name'],
                        }
                    )
                }
            }
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollSubmissionReminders() {
        const subscribers = await this.getNotificationSubscribers(
            'canvas_submission_reminder'
        )
        if (!subscribers) return

        for (const subscriber of subscribers) {
            const accessToken = await this.getAccessToken(subscriber[3])
            if (!accessToken) continue

            const courses = await this.getCourses(subscriber[0], accessToken)
            if (!courses) continue

            for (const course of courses) {
                const courseId = course['id']
                if (!courseId) continue

                const submissionReminders = await this.getSubmissionReminders(
                    subscriber[0],
                    accessToken,
                    courseId
                )
                if (!submissionReminders) continue

                for (const reminder of submissionReminders) {
                    await this.sendNotification(
                        subscriber[2],
                        subscriber[1],
                        `states:${this.externalSystemName}:externalIdentities:${subscriber[1]}:submissionReminders:${reminder['id']}`,
                        {
                            due_at: reminder['due_at'],
                            assignment_id: reminder['id'],
                            assignment_name: reminder['name'],
                            course_id: course['id'],
                            course_name: course['name'],
                        }
                    )
                }
            }
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollSubmissionComments() {
        const subscribers = await this.getNotificationSubscribers(
            'canvas_submission_comment'
        )
        if (!subscribers) return

        for (const subscriber of subscribers) {
            const accessToken = await this.getAccessToken(subscriber[3])
            if (!accessToken) continue

            const parsedAccessToken = JSON.parse(subscriber[3])
            const user = parsedAccessToken['user']
            if (!user) return
            const userId = user['id']
            if (!userId) return

            const courses = await this.getCourses(subscriber[0], accessToken)
            if (!courses) continue

            for (const course of courses) {
                const courseId = course['id']
                if (!courseId) continue

                const submissions = await this.getGradedSubmissions(
                    subscriber[0],
                    accessToken,
                    courseId,
                    userId
                )
                if (!submissions) continue

                for (const submission of submissions) {
                    const comments = this.getSubmissionComments(
                        submission,
                        userId
                    )
                    if (!comments) continue

                    for (const comment of comments) {
                        if (comment['id'] == userId) continue

                        await this.sendNotification(
                            subscriber[2],
                            subscriber[1],
                            `states:${this.externalSystemName}:externalIdentities:${subscriber[1]}:submissions:${submission['id']}:comments:${comment['id']}`,
                            {
                                id: comment['id'],
                                user_id: userId,
                                author_name: comment['author_name'],
                                comment: comment['comment'],
                                submission_id: submission['id'],
                                assignment_id: submission.assignment['id'],
                                assignment_name: submission.assignment['name'],
                                course_id: course['id'],
                                course_name: course['name'],
                            }
                        )
                    }
                }
            }
        }
    }

    private async getCourses(
        hostName: string,
        accessToken: string
    ): Promise<Array<any> | null> {
        const coursesResponse = await fetch(`${hostName}/api/v1/courses`, {
            method: 'GET',
            headers: {
                Authorization: accessToken,
            },
        })
        if (!coursesResponse.ok) return null

        const courses = await coursesResponse.json()

        if (!courses) return null
        else if (!Array.isArray(courses)) return null
        else if (courses.length == 0) return null
        return courses
    }

    private getSubmissionComments(
        submission: any,
        posterId: string
    ): any[] | null {
        try {
            const comments = submission['submission_comments']
            if (!comments || !Array.isArray(comments)) return null

            return comments.filter(
                (comment) => comment['author_id'] != posterId
            )
        } catch (e) {
            Logger.error(
                `Error while getting submission comments: ${e.message}`
            )
        }
        return null
    }

    private async getAnnouncements(
        hostName: string,
        accessToken: string,
        courseId: string
    ): Promise<Array<any> | null> {
        const response = await fetch(
            `${hostName}/api/v1/courses/${courseId}/discussion_topics?only_announcements=true`,
            {
                method: 'GET',
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        if (!response.ok) return null

        const announcements = await response.json()

        if (!announcements) return null
        else if (!Array.isArray(announcements)) return null
        return announcements
    }

    private async getGradedSubmissions(
        hostName: string,
        accessToken: string,
        courseId: string,
        userId: string
    ): Promise<Array<any> | null> {
        const submissionsResponse = await fetch(
            `${hostName}/api/v1/courses/${courseId}/students/submissions?` +
                `student_ids[]=${userId}&` +
                `workflow_state=graded&` +
                `include[]=submission_comments&` +
                `include[]=assignment`,
            {
                method: 'GET',
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        if (!submissionsResponse.ok) return null

        const submissions = await submissionsResponse.json()

        if (!submissions) return null
        else if (!Array.isArray(submissions)) return null
        return submissions
    }

    private async getSubmissionReminders(
        hostName: string,
        accessToken: string,
        courseId: string
    ): Promise<Array<any> | null> {
        const assignmentsResponse = await fetch(
            `${hostName}/api/v1/courses/${courseId}/assignments`,
            {
                method: 'GET',
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        if (!assignmentsResponse.ok) return null

        const assignments = await assignmentsResponse.json()
        if (!assignments) return null

        const upcomingAssignments = assignments.filter((assignment) => {
            const dueDate = assignment['due_at']
            if (!dueDate) return false

            const convertedDueDate = new Date(dueDate)
            const correctedDueDate = new Date(
                convertedDueDate.setHours(convertedDueDate.getHours() - 8)
            )
            return correctedDueDate.getUTCDate() == new Date().getUTCDate()
        })
        return await upcomingAssignments
    }

    private async sendNotification(
        subscriberId: string,
        eventId: string,
        notificationName: string,
        notification: any
    ): Promise<void> {
        if (
            await this.isNewNotification(
                subscriberId,
                notificationName,
                notification
            )
        ) {
            await this.eventService.sendNotification(
                [subscriberId],
                eventId,
                notification
            )
            await this.updateNotificationState(
                subscriberId,
                notificationName,
                notification
            )
        }
    }
}
