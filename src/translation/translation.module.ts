import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import {
    NOTIFICATION_TRANSLATORS,
    NotificationTranslatorRegistry,
} from './translators/notification-translator.registry'
import { NotificationTranslator } from './translators/notification-translator'
import { CanvasNotificationTranslator } from './translators/canvas.translator'
import { WelcomeNotificationTranslator } from './translators/welcome.translator'

const translatorClasses = [
    CanvasNotificationTranslator,
    WelcomeNotificationTranslator,
]

const translatorProviders = [
    ...translatorClasses,
    {
        provide: NOTIFICATION_TRANSLATORS,
        useFactory: (
            ...translators: NotificationTranslator[]
        ): NotificationTranslator[] => translators,
        inject: translatorClasses,
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
