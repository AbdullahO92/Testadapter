import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class ConfigService {
    private readonly prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async get(key: string): Promise<any> {
        const config = await this.prisma.config.findUnique({
            where: { key },
        })
        return config?.value
    }
}
