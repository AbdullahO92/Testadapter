import { Inject, Injectable } from '@nestjs/common'
import { GenericAdapterConnector } from './generic-adapter.connector'

export const GENERIC_ADAPTER_CONNECTORS = 'GENERIC_ADAPTER_CONNECTORS'

@Injectable()
export class GenericAdapterConnectorRegistry {
    constructor(
        @Inject(GENERIC_ADAPTER_CONNECTORS)
        private readonly connectors: GenericAdapterConnector[]
    ) {}

    resolve(vendor: string): GenericAdapterConnector | undefined {
        return this.connectors.find((connector) => connector.supports(vendor))
    }
}
