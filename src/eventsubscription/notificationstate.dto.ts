export class NotificationStateDto {
    public readonly externalIdentityId: string
    public readonly eventMappingId: string
    public readonly notificationHash: string | null

    constructor(
        externalIdentityId: string,
        eventMappingId: string,
        notificationHash: string | null
    ) {
        this.externalIdentityId = externalIdentityId
        this.eventMappingId = eventMappingId
        this.notificationHash = notificationHash
    }
}
