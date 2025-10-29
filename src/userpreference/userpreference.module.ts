import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserPreferenceController } from './userpreference.controller'
import { UserPreferenceService } from './userpreference.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'AzureAD',
        }),
    ],
    providers: [UserPreferenceService, PrismaService],
    controllers: [UserPreferenceController],
})
export class UserPreferenceModule {}
