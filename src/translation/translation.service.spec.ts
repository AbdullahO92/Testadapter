import { Test, TestingModule } from '@nestjs/testing'
import { TranslationService } from './translation.service'
import { NotificationTranslatorRegistry } from './providers/notification-translator.registry'
import { CanvasNotificationTranslator } from './providers/canvas-notification.translator'
import { BrightspaceNotificationTranslator } from './providers/brightspace-notification.translator'
import { BlackboardNotificationTranslator } from './providers/blackboard-notification.translator'
import { CampusSolutionsNotificationTranslator } from './providers/campus-solutions-notification.translator'
import { WelcomeNotificationTranslator } from './providers/welcome-notification.translator'
import { NOTIFICATION_TRANSLATORS } from './providers/notification-translator.registry'
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
                BrightspaceNotificationTranslator,
                BlackboardNotificationTranslator,
                CampusSolutionsNotificationTranslator,
                WelcomeNotificationTranslator,
                {
                    provide: NOTIFICATION_TRANSLATORS,
                    useFactory: (
                        canvas: CanvasNotificationTranslator,
                        brightspace: BrightspaceNotificationTranslator,
                        blackboard: BlackboardNotificationTranslator,
                        campus: CampusSolutionsNotificationTranslator,
                        welcome: WelcomeNotificationTranslator
                    ) => [canvas, brightspace, blackboard, campus, welcome],
                    inject: [
                        CanvasNotificationTranslator,
                        BrightspaceNotificationTranslator,
                        BlackboardNotificationTranslator,
                        CampusSolutionsNotificationTranslator,
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
