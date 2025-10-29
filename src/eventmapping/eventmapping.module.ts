import { Module } from '@nestjs/common'
import { EventMappingRepository } from './eventmapping.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    exports: [EventMappingRepository],
    providers: [EventMappingRepository, PrismaService],
    controllers: [],
})
export class EventMappingModule {}
