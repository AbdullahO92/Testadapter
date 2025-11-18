import { Provider } from '@nestjs/common'
import { TranslationService } from './translation.service'
import {
    NotificationTranslatorRegistry,
    TRANSLATORS,
} from './translators/translator.registry'
import { NotificationTranslator } from './translators/notification-translator'
import { CanvasNotificationTranslator } from './translators/canvas.translator'
import { WelcomeNotificationTranslator } from './translators/welcome.translator'
import { CampusSolutionsNotificationTranslator } from './translators/campus-solutions.translator'

export const TRANSLATION_TRANSLATOR_CLASSES = [
    CanvasNotificationTranslator,
    WelcomeNotificationTranslator,
    CampusSolutionsNotificationTranslator,
]

export const TRANSLATION_TRANSLATOR_PROVIDERS: Provider[] = [
    ...TRANSLATION_TRANSLATOR_CLASSES,
    {
        provide: TRANSLATORS,
        useFactory: (
            ...translators: NotificationTranslator[]
        ): NotificationTranslator[] => translators,
        inject: TRANSLATION_TRANSLATOR_CLASSES,
    },
]

export const TRANSLATION_PROVIDERS: Provider[] = [
    TranslationService,
    NotificationTranslatorRegistry,
    ...TRANSLATION_TRANSLATOR_PROVIDERS,
]

export const TRANSLATION_EXPORTS = [
    TranslationService,
    NotificationTranslatorRegistry,
    ...TRANSLATION_TRANSLATOR_CLASSES,
    TRANSLATORS,
]
