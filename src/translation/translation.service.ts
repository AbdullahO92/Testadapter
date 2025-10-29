import { Injectable } from '@nestjs/common'
import { NotificationDto } from 'src/event/event.dto'
import { ExternalSystemResponseDto } from 'src/externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from 'src/user/user.dto'

function translate(
    response: ExternalSystemResponseDto,
    user: UserDto,
    body: any
): NotificationDto | null {
    switch (response.internalName) {
        case 'welcome':
            return translateWelcome(user.id)
        case 'canvas_welcome':
            return translateCanvasWelcome(user.id)
        case 'canvas_announcement':
            return translateAnnouncement(user.id, body)
        case 'canvas_grade':
            return translateGrade(user.id, body)
        case 'canvas_submission_reminder':
            return translateSubmissionReminder(user.id, body)
        case 'canvas_submission_comment':
            return translateSubmissionComment(user.id, body)
        default:
            return null
    }
}

function translateAnnouncement(userId: string, body: any): NotificationDto {
    const eventId = 3 // Hardcoded eventId
    //const url: string | null = body.html_url || "";
    //const title: string | null = body.title;
    let message: string | null = body.message
    //if (!url || !title || !message) return null;
    message = message
        .replaceAll('<p>', '')
        .replaceAll('</p>', '')
        .replaceAll('<span>', '')
        .replaceAll('</span>', '')
        .replaceAll('<div>', '')
        .replaceAll('</div>', '')

    // const courseIdMatch = url.match(/courses\/(\d+)/);
    // const announcementIdMatch = url.match(/discussion_topics\/(\d+)/);

    // if (!url || !courseIdMatch || !announcementIdMatch) {
    //   throw new Error("Missing required html_url, course_id, or announcement_id");
    // }

    return new NotificationDto(userId, eventId, null, {
        announcement_title: body.title,
        announcement_message: message,
        course_id: body.course_id,
        announcement_id: body.announcement_id,
        //module_item_id: ""
    })
}

function translateSubmissionReminder(
    userId: string,
    body: any
): NotificationDto {
    const eventId = 7 // Hardcoded eventId
    //const url: string | null = body.html_url;
    //const assignmentName: string | null = body.name;
    //const courseName: string | null = body.course_name;
    // const dueDate: string | null = body.due_at
    //if (!url || !assignmentName || !courseName || !dueDate) return null;

    // const courseIdMatch = url.match(/courses\/(\d+)/);
    // const assignmentIdMatch = url.match(/assignments\/(\d+)/);

    // if (!url || !courseIdMatch || !assignmentIdMatch) {
    //   throw new Error("Missing required html_url, course_id, or announcement_id");
    // }

    // Thanks Canvas
    // const convertedDueDate = new Date(dueDate);
    // const correctedDueDate = new Date(convertedDueDate.setHours(convertedDueDate.getHours() - 8));
    // console.log(correctedDueDate);

    return new NotificationDto(userId, eventId, null, {
        course_name: body.course_name,
        assignment_name: body.assignment_name,
        due_at: new Date(body.due_at).toTimeString().substring(0, 5), //correctedDueDate.toTimeString().substring(0, 5),
        course_id: body.course_id,
        assignment_id: body.assignment_id,
    })
}

function translateSubmissionComment(
    userId: string,
    body: any
): NotificationDto {
    const eventId = 2 // Hardcoded eventId
    //const url: string | null = body.html_url;
    //const assignmentName: string | null = body.name;
    //const courseName: string | null = body.course_name;
    const dueDate: string | null = body.due_at
    //if (!url || !assignmentName || !courseName || !dueDate) return null;

    // const courseIdMatch = url.match(/courses\/(\d+)/);
    // const assignmentIdMatch = url.match(/assignments\/(\d+)/);

    // if (!url || !courseIdMatch || !assignmentIdMatch) {
    //   throw new Error("Missing required html_url, course_id, or announcement_id");
    // }

    // Thanks Canvas
    const convertedDueDate = new Date(dueDate)
    const correctedDueDate = new Date(
        convertedDueDate.setHours(convertedDueDate.getHours() - 8)
    )
    // console.log(correctedDueDate)
    // console.log(body.comment)

    return new NotificationDto(userId, eventId, null, {
        id: body.id,
        user_id: userId,
        assessor_full_name: body.author_name,
        feedback_text: 'Received comment:',
        feedback_details: body.comment,
        submission_id: body.submission_id,
        course_name: body.course_name,
        assignment_title: body.assignment_name,
        due_at: correctedDueDate.toTimeString().substring(0, 5),
        course_id: body.course_id,
        assignment_id: body.assignment_id,
    })
}

function translateGrade(userId: string, body: any): NotificationDto {
    const eventId = 1 // Hardcoded eventId

    //if (!body || !body.assignment || !body.preview_url) return null

    // Extract course_id from preview_url if not present in assignment
    //const courseIdMatch = body.preview_url.match(/courses\/(\d+)/)
    //const assignmentIdMatch = body.preview_url.match(/assignments\/(\d+)/)

    // Find the instructor's comment (assessor) if available
    const assessor_feedback = 'No comment was left by the assessor.'

    // if (Array.isArray(body.submission_comments) && body.submission_comments.length > 0) {
    //     // Try to find a comment by the grader, otherwise use the last comment
    //     let commentObj = body.submission_comments.find(
    //         (c: any) => c.author_id === body.grader_id
    //     ) || body.submission_comments[body.submission_comments.length - 1]

    //     if (commentObj) assessor_feedback = commentObj.comment
    // }

    return new NotificationDto(userId, eventId, null, {
        assignment_name: body.assignment_name,
        grade: body.grade,
        assessor_feedback: body.assessor_feedback ?? assessor_feedback,
        course_id: body.course_id,
        assignment_id: body.assignment_id,
        //module_item_id: moduleItemIdMatch ? moduleItemIdMatch[1] : '',
    })
}

function translateCanvasWelcome(userId: string): NotificationDto {
    return new NotificationDto(userId, 8, null, {})
}

function translateWelcome(userId: string): NotificationDto {
    return new NotificationDto(
        userId,
        5,
        null,
        JSON.stringify({
            user_name: 'Hello there!',
            welcome_message:
                "Welcome to the student companion app! We're glad to have you here. This app is designed to support you throughout your acedemic journey by bringing important course notifications straight into Microsoft Teams. Take a quick tour of the app to get familiar with its features.",
            welcome_text:
                "With everything in one place, you can stay focused, organized, and in control of your studies. Let's make your learning experience smoother and more connected!",
            welcome_image_url: 'https://i.imgur.com/VkScWm0.png',
        })
    )
}

@Injectable()
export class TranslationService {
    translateBodyToCard(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto {
        // offeringType is no longer used, eventId is hardcoded
        return translate(response, user, body)
    }
}
