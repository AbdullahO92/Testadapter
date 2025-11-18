import { Test, TestingModule } from '@nestjs/testing'
import { TranslationService } from './translation.service'
import { NotificationTranslatorRegistry } from './translators/translator.registry'
import { CanvasNotificationTranslator } from './translators/canvas.translator'
import { WelcomeNotificationTranslator } from './translators/welcome.translator'
import { TRANSLATORS } from './translators/translator.registry'
import { CampusSolutionsNotificationTranslator } from './translators/campus-solutions.translator'
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
                CampusSolutionsNotificationTranslator,
                {
                    provide: TRANSLATORS,
                    useFactory: (
                        canvas: CanvasNotificationTranslator,
                        welcome: WelcomeNotificationTranslator,
                        campus: CampusSolutionsNotificationTranslator
                    ) => [canvas, welcome, campus],
                    inject: [
                        CanvasNotificationTranslator,
                        WelcomeNotificationTranslator,
                        CampusSolutionsNotificationTranslator,
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

    it('translates Campus Solutions schedule changes', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-7',
            externalSystemId: 'system-1',
            internalName: 'campus_solutions_schedule_change',
            displayName: 'Campus schedule change',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-7',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            courseCode: 'BIO101',
            courseTitle: 'Biology',
            changeType: 'Room change',
            effectiveDate: '2025-04-02T10:00:00.000Z',
            location: 'Science Hall 1',
            instructor: 'Dr. Green',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(9)
        expect(result?.data.course_code).toBe('BIO101')
        expect(result?.data.location).toBe('Science Hall 1')
    })

    it('translates Campus Solutions financial holds', () => {
        const response = new ExternalSystemResponseDto({
            id: 'response-8',
            externalSystemId: 'system-1',
            internalName: 'campus_solutions_financial_hold',
            displayName: 'Campus financial hold',
            description: null,
        } as any)

        const user = new UserDto({
            id: 'user-8',
            isActive: true,
            termsAgreedAt: null,
            privacyAgreedAt: null,
        } as any)

        const result = service.translateBodyToCard(response, user, {
            holdType: 'Advising hold',
            reason: 'Meet with your advisor',
            effectiveDate: '2025-05-01T08:00:00.000Z',
            contact: 'advising@example.edu',
        })

        expect(result).toBeTruthy()
        expect(result?.eventId).toBe(11)
        expect(result?.data.hold_type).toBe('Advising hold')
        expect(result?.data.contact).toBe('advising@example.edu')
    })
})
