// KeyVault integration tests require optional infrastructure. Skip when the
// legacy service is not available in the source tree.
let AzureKeyVaultConfigService: any = null
try {
    AzureKeyVaultConfigService = require('../src/keyvault-old/keyvault-config.service')
        .AzureKeyVaultConfigService
} catch (error) {
    // No-op – service was removed or not part of the current build.
}

const describeOrSkip = AzureKeyVaultConfigService ? describe : describe.skip


describeOrSkip('AzureKeyVaultConfigService', () => {
    let secretClient: any

    beforeEach(() => {
        secretClient = new AzureKeyVaultConfigService(
            'https://cy2-sca-vault.vault.azure.net/'
        )
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
