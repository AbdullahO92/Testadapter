import { Test, TestingModule } from '@nestjs/testing'
import { TranslationService } from './translation.service'
import { NotificationTranslatorRegistry } from './translators/notification-translator.registry'
import { CanvasNotificationTranslator } from './translators/canvas.translator'
import { WelcomeNotificationTranslator } from './translators/welcome.translator'
import { NOTIFICATION_TRANSLATORS } from './translators/notification-translator.registry'
import { ExternalSystemResponseDto } from 'src/externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from 'src/user/user.dto'

describe('TranslationService', () => {
    let service: TranslationService
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                TranslationService,
                NotificationTranslatorRegistry,
                CanvasNotificationTranslator,
                WelcomeNotificationTranslator,
                {
                    provide: NOTIFICATION_TRANSLATORS,
                    useFactory: (
                        canvas: CanvasNotificationTranslator,
                        welcome: WelcomeNotificationTranslator
                    ) => [canvas, welcome],
                    inject: [
                        CanvasNotificationTranslator,
                        WelcomeNotificationTranslator,
                    ],
                },
            ],
        }).compile()

        service = module.get(TranslationService)
    })

    afterEach(async () => {
        await module.close()
    })

    it('translates a Canvas announcement payload', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-1',
            externalSystemId: 'system-1',
            internalName: 'canvas_announcement',
            displayName: 'Canvas announcement',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-1',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            title: 'Exam reminder',
            message: '<p>Please study Chapter 5</p>',
            course_id: 'course-1',
        })

        expect(result).toBeTruthy()
        expect(result?.data.announcement_title).toBe('Exam reminder')
        expect(result?.data.announcement_message).toBe(
            'Please study Chapter 5'
        )
    })

    it('translates Canvas grade payloads with assessor feedback', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-3',
            externalSystemId: 'system-1',
            internalName: 'canvas_grade',
            displayName: 'Canvas grade',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-3',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            assignmentName: 'Essay 1',
            grade: 'A',
            assessor: 'Prof. Brown',
            courseId: 'course-2',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(1)
        expect(result?.data.assignment_name).toBe('Essay 1')
        expect(result?.data.assessor_feedback).toBe('Prof. Brown')
    })

    it('translates Canvas submission reminder payloads', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-4',
            externalSystemId: 'system-1',
            internalName: 'canvas_submission_reminder',
            displayName: 'Canvas reminder',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-4',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            assignmentName: 'Essay 2',
            dueAt: '2023-09-01T08:30:00.000Z',
            courseId: 'course-3',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(7)
        expect(result?.data.assignment_name).toBe('Essay 2')
        expect(result?.data.due_at).toBe('08:30')
    })

    it('translates Canvas submission comment payloads', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-5',
            externalSystemId: 'system-1',
            internalName: 'canvas_submission_comment',
            displayName: 'Canvas comment',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-5',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            comment: 'Great job!',
            assessor: 'Prof. Grey',
            courseId: 'course-4',
            assignmentId: 'assignment-1',
            dueAt: '2023-09-01T12:00:00.000Z',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(2)
        expect(result?.data.assessor_full_name).toBe('Prof. Grey')
        expect(result?.data.feedback_details).toBe('Great job!')
    })

    it('translates Canvas welcome payloads', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-6',
            externalSystemId: 'system-1',
            internalName: 'canvas_welcome',
            displayName: 'Canvas welcome',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-6',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            message: 'Hello Canvas user!',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(8)
        expect(result?.data).toEqual({})
    })

    it('returns null when no translator matches', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-2',
            externalSystemId: 'system-1',
            internalName: 'unknown_response',
            displayName: 'Unknown',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-2',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {})

        expect(result).toBeNull()
    })
})
