import { Injectable, Logger } from '@nestjs/common'
import { NotificationDto } from 'src/event/event.dto'
import { ExternalSystemResponseDto } from 'src/externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from 'src/user/user.dto'
import { NotificationTranslatorRegistry } from './translators/translator.registry'

@Injectable()
export class TranslationService {
    private readonly logger = new Logger(TranslationService.name)

    constructor(
        private readonly translatorRegistry: NotificationTranslatorRegistry
    ) {}

    translateBodyToCard(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
            const translator = this.translatorRegistry.resolve(response)

            if (!translator) {
                this.logger.warn(
                    `No translator registered for response "${response.internalName}".`
                )
                return null
            }

            return translator.translate(response, user, body)
        }
    }