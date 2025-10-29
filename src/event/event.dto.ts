export class NotificationDto {
    readonly eventId: number
    readonly userId: string
    readonly messageId: string | null
    readonly data: any

    constructor(
        userId: string,
        eventId: number,
        messageId: string | null,
        data: any
    ) {
        ;(this.eventId = eventId),
            (this.userId = userId),
            (this.messageId = messageId),
            (this.data = data)
    }
}
