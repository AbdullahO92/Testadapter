import { NestApplication, NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Logger, VersioningType } from '@nestjs/common'
import { AppModule } from './app.module'
import metadata from './metadata'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(),
    })

    const logger = new Logger(NestApplication.name)
    const configService: ConfigService = app.get<ConfigService>(ConfigService)

    const port = configService.get<number>('API_PORT') || 3000

    app.enableVersioning({
        type: VersioningType.URI,
    })

    if (configService.get<string>('ENVIRONMENT') === 'development') {
        const config = new DocumentBuilder()
            .setTitle('CY2 SCA API')
            .setDescription(
                'This API is used by the CY2 Student Companion App (SCA) and its primary purpose is to integrate with external systems and provide data to the app.'
            )
            .setVersion('0.0.3')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            })
            .addSecurityRequirements('bearer')
            .setContact(
                'CY2 SCA Team',
                'https://cy2.com',
                'koen.janssen@cy2.nl'
            )
            .build()
        await SwaggerModule.loadPluginMetadata(metadata)
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        })
    }

    app.enableCors({
        origin: '*', // Allow all origins
    })

    await app.listen(port)
    logger.log(`Application started and listening on ${await app.getUrl()}`)
}
bootstrap()
