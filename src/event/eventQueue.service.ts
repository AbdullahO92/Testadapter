import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus'

@Injectable()
export class NotificationQueueService {
    private readonly connectionString: string
    private readonly queueName: string
    private readonly serviceBusClient: ServiceBusClient

    constructor(private readonly configService: ConfigService) {
        this.queueName = this.configService.get<string>(
            'AZURE_SERVICE_BUS_QUEUE_NAME'
        )
        this.connectionString = this.configService.get<string>(
            'AZURE_SERVICE_BUS_CONNECTION_STRING'
        )
        if (!this.connectionString || !this.queueName) {
            throw new Error(
                'Connection string or queue name is not defined in the environment variables'
            )
        }

        this.serviceBusClient = new ServiceBusClient(this.connectionString)
    }

    sendMessageToQueue(payload: any = {}): void {
        const serviceBusSender: ServiceBusSender =
            this.serviceBusClient.createSender(this.queueName)
        serviceBusSender
            .sendMessages({
                body: payload,
            })
            .then(() => {
                // metricService.increment('queue.message.sent', 1, {
                //     queueName: this.queueName,
                // })
                Logger.log(
                    `Message sent to queue: ${this.queueName}`,
                    NotificationQueueService.name
                )
            })
            .catch((err) => {
                Logger.error(
                    `Error sending message to queue: ${this.queueName}`,
                    NotificationQueueService.name,
                    err
                )
            })
            .finally(() => {
                serviceBusSender.close().catch((err) => {
                    Logger.error(
                        `Error closing sender for queue: ${this.queueName}`,
                        NotificationQueueService.name,
                        err
                    )
                })
            })
    }
}
