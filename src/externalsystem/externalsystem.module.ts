import { Module } from '@nestjs/common'
import { ExternalSystemRepository } from './externalsystem.repository'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [ExternalSystemRepository],
    providers: [ExternalSystemRepository, PrismaService],
    controllers: [],
})
export class ExternalSystemModule {}
