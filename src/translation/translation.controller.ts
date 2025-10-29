import { Injectable, Logger } from '@nestjs/common'
import { TranslationService } from './translation.service'

@Injectable()
export class TranslationController {
    private readonly logger = new Logger(TranslationController.name)

    constructor(private readonly translationService: TranslationService) {}

    /**
     * Translates a Canvas payload to a CardInput.
     * This method is intended to be called programmatically.
     * @param topic Canvas payload (raw, unvalidated)
     * @param userId The user ID to associate with the translation
     * @returns CardInput
     */
    translateToCardInput(topic: any, userId: string) {
        try {
            return ''
            //return this.translationService.translateBodyToCard(topic, userId)
        } catch (e) {
            this.logger.error('Error translating announcement', e.stack || e)
            throw e
        }
    }
}
