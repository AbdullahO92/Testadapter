import { Injectable } from '@nestjs/common'
import { NotificationDto } from '../../event/event.dto'
import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'
import { BaseNotificationTranslator } from './notification-translator'

@Injectable()
export class WelcomeNotificationTranslator extends BaseNotificationTranslator {
    protected readonly internalNames = ['welcome']

    protected translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): NotificationDto | null {
        return new NotificationDto(
            user.id,
            5,
            null,
            JSON.stringify({
                user_name: 'Hello there!',
                welcome_message:
                    "Welcome to the student companion app! We're glad to have you here. This app is designed to support you throughout your academic journey by bringing important course notifications straight into Microsoft Teams. Take a quick tour of the app to get familiar with its features.",
                welcome_text:
                    "With everything in one place, you can stay focused, organized, and in control of your studies. Let's make your learning experience smoother and more connected!",
                welcome_image_url: 'https://i.imgur.com/VkScWm0.png',
            })
        )
    }
}
