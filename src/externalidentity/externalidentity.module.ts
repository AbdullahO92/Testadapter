import { Module } from '@nestjs/common'
import { ExternalIdentityRepository } from './externalidentity.repository'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [ExternalIdentityRepository],
    providers: [ExternalIdentityRepository, PrismaService],
    controllers: [],
})
export class ExternalIdentityModule {}
