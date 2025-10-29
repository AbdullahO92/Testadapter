import { ExternalSystemResponse } from '@prisma/client'

export class ExternalSystemResponseDto {
    public readonly id: string
    public readonly externalSystemId: string
    public readonly internalName: string
    public readonly displayName: string
    public readonly description: string | null

    constructor(response: ExternalSystemResponse) {
        this.id = response.id
        this.externalSystemId = response.externalSystemId
        this.internalName = response.internalName
        this.displayName = response.displayName
        this.description = response.description
    }
}
