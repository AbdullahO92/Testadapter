import { Module } from '@nestjs/common'
import { ExternalSystemResponseRepository } from './externalsystemresponse.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [ExternalSystemResponseRepository],
    providers: [ExternalSystemResponseRepository, PrismaService],
    controllers: [],
})
export class ExternalSystemResponseModule {}
