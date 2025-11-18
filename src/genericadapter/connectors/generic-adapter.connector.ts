import { Injectable } from '@nestjs/common'

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

@Injectable()
export abstract class BaseConnector implements GenericAdapterConnector {
    abstract readonly vendor: string

    supports(vendor: string): boolean {
        return this.vendor.toLowerCase() === vendor.toLowerCase()
    }

    async buildPayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>> {
        const payload = await this.normalizePayload(preview, response)
        return payload
    }

    protected getPreviewPayload(
        preview: GenericAdapterPreviewDto
    ): Record<string, any> {
        return preview.payload ?? {}
    }

    protected abstract normalizePayload(
        preview: GenericAdapterPreviewDto,
        response: ExternalSystemResponseDto
    ): Promise<Record<string, any>>
}
