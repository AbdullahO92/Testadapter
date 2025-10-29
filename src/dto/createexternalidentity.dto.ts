export class CreateExternalIdentityDto {
    readonly systemType: string
    readonly systemName: boolean
    readonly extId: string
    readonly version: string
    readonly user: User
}

export class User {
    readonly id: string
}
