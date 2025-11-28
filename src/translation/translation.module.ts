import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import {
    TRANSLATION_EXPORTS,
    TRANSLATION_PROVIDERS,
} from './translation.providers'

@Module({

    providers: TRANSLATION_PROVIDERS,
    exports: TRANSLATION_EXPORTS,
    imports: [],
    controllers: [],
})
export class TranslationModule {}