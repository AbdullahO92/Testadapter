import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { PassportModule } from '@nestjs/passport'
import { NewsService } from './news.service'
import { NewsBroker } from './news.broker'
import { NewsController } from './news.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({
            defaultStrategy: 'AzureAD',
        }),
        CacheModule.register({
            ttl: 900, // seconds
        }),
    ],
    controllers: [NewsController],
    providers: [NewsService, NewsBroker],
})
export class NewsModule {}
