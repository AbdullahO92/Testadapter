import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'AzureAD',
        }),
    ],
    providers: [UserService, PrismaService],
    controllers: [UserController],
})
export class UserModule {}
