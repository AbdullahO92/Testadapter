import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { UserDto } from '../../user/user.dto'

export interface Translator<TOutput> {
    supports(response: ExternalSystemResponseDto): boolean

    translate(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): TOutput | null
}

export abstract class BaseTranslator<TOutput>
    implements Translator<TOutput>
{
    protected abstract readonly internalNames: string[]

    supports(response: ExternalSystemResponseDto): boolean {
        return this.internalNames.includes(response.internalName)
    }

    translate(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): TOutput | null {
        return this.translateInternal(response, user, body)
    }

    protected abstract translateInternal(
        response: ExternalSystemResponseDto,
        user: UserDto,
        body: any
    ): TOutput | null
}
