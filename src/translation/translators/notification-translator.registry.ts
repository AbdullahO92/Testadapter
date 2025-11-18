import { Inject, Injectable } from '@nestjs/common'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { NotificationTranslator } from './notification-translator'

export const NOTIFICATION_TRANSLATORS = 'NOTIFICATION_TRANSLATORS'

@Injectable()
export class NotificationTranslatorRegistry {
    constructor(
        @Inject(NOTIFICATION_TRANSLATORS)
        private readonly translators: NotificationTranslator[]
    ) {}

    resolve(
        response: ExternalSystemResponseDto
    ): NotificationTranslator | undefined {
        return this.translators.find((translator) =>
            translator.supports(response)
        )
    }
}
