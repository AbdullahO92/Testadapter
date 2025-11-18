import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import { TranslationController } from './translation.controller'
import {
    NOTIFICATION_TRANSLATORS,
    NotificationTranslatorRegistry,
} from './providers/notification-translator.registry'
import { CanvasNotificationTranslator } from './providers/canvas-notification.translator'
import { BrightspaceNotificationTranslator } from './providers/brightspace-notification.translator'
import { BlackboardNotificationTranslator } from './providers/blackboard-notification.translator'
import { CampusSolutionsNotificationTranslator } from './providers/campus-solutions-notification.translator'
import { WelcomeNotificationTranslator } from './providers/welcome-notification.translator'

const translatorProviders = [
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
]

@Module({
    providers: [
        TranslationService,
        NotificationTranslatorRegistry,
        ...translatorProviders,
    ],
    exports: [TranslationService],
    imports: [],
    controllers: [],
})
export class TranslationModule {}
