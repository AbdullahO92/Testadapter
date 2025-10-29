import { Injectable, Logger } from '@nestjs/common'
import { createClient } from 'redis'

import { ConfigService } from '@nestjs/config'
import { StorageHandler } from '../storagehandler'

@Injectable()
export class RedisStorageHandler extends StorageHandler {
    private readonly hostName: string
    private readonly portNumber: number
    private readonly redisUrl: string

    private readonly logger = new Logger(RedisStorageHandler.name)

    constructor(private readonly configService: ConfigService) {
        super()

        this.hostName =
            this.configService.get<string>('REDIS_HOST') ?? 'localhost'
        this.portNumber = this.configService.get<number>('REDIS_PORT') ?? 6379
        this.redisUrl =
            this.configService.get<string>('REDIS_URL') ??
            `redis://${this.hostName}:${this.portNumber}`
    }

    public async get(name: string): Promise<string | null> {
        const redisClient = createClient({
            url: this.redisUrl,
        })
        redisClient.on('error', (err) =>
            this.logger.error('Redis Client Error', err)
        )
        await redisClient.connect()

        const result = await redisClient.get(name)

        redisClient.destroy()
        if (typeof result === 'string') return result
        return null
    }

    public async set(
        name: string,
        value: string,
        timeToLive: number | null
    ): Promise<string | null> {
        const redisClient = createClient({
            url: this.redisUrl,
        })
        redisClient.on('error', (err) =>
            this.logger.error('Redis Client Error', err)
        )
        await redisClient.connect()

        let result: string | null = null
        if (timeToLive) {
            await redisClient.set(name, value, {
                expiration: { type: 'EX', value: timeToLive },
            })
            result = value
        } else {
            await redisClient.set(name, value)
            result = value
        }

        redisClient.destroy()
        return result
    }

    public async delete(name: string): Promise<boolean> {
        const redisClient = createClient({
            url: this.redisUrl,
        })
        redisClient.on('error', (err) =>
            this.logger.error('Redis Client Error', err)
        )
        await redisClient.connect()

        const result = await redisClient.del(name)
        const deletedRecordCount: number =
            typeof result === 'number' ? result : +result

        redisClient.destroy()
        return deletedRecordCount > 0
    }
}
