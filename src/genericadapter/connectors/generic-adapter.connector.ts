import { ExternalSystemResponseDto } from '../../externalsystemresponse/externalsystemresponse.dto'
import { GenericAdapterPreviewDto } from '../dto/generic-adapter-preview.dto'

export interface GenericAdapterConnector {
    readonly vendor: string

    supports(vendor: string): boolean

    buildPayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>>
}
