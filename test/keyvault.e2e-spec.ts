// @ts-ignore
import { AzureKeyVaultConfigService } from "../src/keyvault-old/keyvault-config.service"
import { DefaultAzureCredential } from '@azure/identity'

describe('AzureKeyVaultConfigService', () => {
    let secretClient: AzureKeyVaultConfigService

    beforeEach(async () => {
        const keyVaultURI = 'https://cy2-sca-vault.vault.azure.net/'
        const credential = new DefaultAzureCredential()
        secretClient = new AzureKeyVaultConfigService(keyVaultURI)
    })

    it('should fetch secret value successfully', async () => {
        const secretName = 'azure-ad-tenantid'
        const result = await secretClient.get(secretName)
        expect(result).toBeDefined()
    })

    it('should return undefined if secret does not exist', async () => {
        const secretName = 'nonExistentSecrets'

        const result = await secretClient.get(secretName)
        expect(result).toBeUndefined()
    })
})
