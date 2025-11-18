import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'

export interface NotificationTranslator {
    supports(response: ExternalSystemResponseDto): boolean

    translate(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null
}

export abstract class BaseNotificationTranslator
    implements NotificationTranslator
{
    protected abstract readonly internalNames: string[]

    supports(response: ExternalSystemResponseDto): boolean {
        return this.internalNames.includes(response.internalName)
    }

    translate(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        return this.translateInternal(response, user, body)
    }

    protected abstract translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null
}
