import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import { TranslationController } from './translation.controller'
import {
    NOTIFICATION_TRANSLATORS,
    NotificationTranslatorRegistry,
} from './providers/notification-translator.registry'
import { CanvasNotificationTranslator } from './providers/canvas-notification.translator'
import { WelcomeNotificationTranslator } from './providers/welcome-notification.translator'

const translatorProviders = [
    CanvasNotificationTranslator,
    WelcomeNotificationTranslator,
    {
        provide: NOTIFICATION_TRANSLATORS,
        useFactory: (
            canvas: CanvasNotificationTranslator,
            welcome: WelcomeNotificationTranslator
        ) => [canvas, welcome],
        inject: [CanvasNotificationTranslator, WelcomeNotificationTranslator],
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
