import { NotificationDto } from '../../event/event.dto'
import { Translator, BaseTranslator } from './translator'

export interface NotificationTranslator
    extends Translator<NotificationDto> {}

export abstract class BaseNotificationTranslator
    extends BaseTranslator<NotificationDto>
    implements NotificationTranslator {}
