import * as crypto from 'crypto'

export class RotatingKeyHandler {
    private key: crypto.KeyObject
    private iv: Buffer<ArrayBufferLike>

    constructor() {
        this.key = this.generateKey()
        this.iv = this.generateIv()
    }

    public getKey(): crypto.KeyObject {
        return this.key
    }

    public getIV(): Buffer<ArrayBufferLike> {
        return this.iv
    }

    private generateKey(): crypto.KeyObject {
        return crypto.generateKeySync('aes', {
            length: 256,
        })
    }

    private generateIv(): Buffer<ArrayBufferLike> {
        return crypto.randomBytes(12)
    }
}
