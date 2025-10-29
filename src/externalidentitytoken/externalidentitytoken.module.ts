import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExternalIdentityTokenRepository } from './externalidentitytoken.repository'

@Module({
    imports: [],
    exports: [ExternalIdentityTokenRepository],
    providers: [ExternalIdentityTokenRepository, PrismaService],
    controllers: [],
})
export class ExternalIdentityTokenModule {}
