import { User } from '@prisma/client'

export class UserDto {
    public readonly id: string
    public readonly isActive: boolean
    public readonly termsAgreedAt: Date | null
    public readonly privacyAgreedAt: Date | null

    constructor(user: User) {
        this.id = user.id
        this.isActive = user.isActive
        this.termsAgreedAt = user.termsAgreedAt
        this.privacyAgreedAt = user.privacyAgreedAt
    }
}
