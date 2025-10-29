import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExternalSystemConfigurationHostHandler } from 'src/entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler.host'
import { EventService } from 'src/event/event.service'
import { EventSubscriptionRepository } from 'src/eventsubscription/eventsubscription.repository'
import { ExternalIdentityDto } from 'src/externalidentity/externalidentity.dto'
import { ExternalIdentityRepository } from 'src/externalidentity/externalidentity.repository'
import { ExternalIdentityTokenUpdateDto } from 'src/externalidentitytoken/externalidentitytoken.update.dto'
import { ExternalSystemRepository } from 'src/externalsystem/externalsystem.repository'
import { ExternalSystemConfigurationDto } from 'src/externalsystemconfiguration/externalsystemconfiguration.dto'
import { ExternalSystemConfigurationRepository } from 'src/externalsystemconfiguration/externalsystemconfiguration.repository'
import { UserService } from 'src/user/user.service'
import { EventMappingHandler } from '../../entityhandler/eventmapping/eventmappinghandler'
import { EventSubscriptionHandler } from '../../entityhandler/eventsubscription/eventsubscriptionhandler'
import { ExternalIdentityHandler } from '../../entityhandler/externalidentity/externalidentityhandler'
import { ExternalSystemHandler } from '../../entityhandler/externalsystem/externalsystemhandler'
import { ExternalSystemConfigurationHandler } from '../../entityhandler/externalsystemconfiguration/externalsystemconfigurationhandler'
import { ExternalSystemResponseHandler } from '../../entityhandler/externalsystemresponse/externalsystemresponsehandler'
import { StateHandler } from '../../statehandler/statehandler'
import { CanvasTokenHandler } from '../../tokenhandler/canvas/tokenhandler.canvas'
import { NotificationService } from '../notification.service'

@Injectable()
export class CanvasNotificationService extends NotificationService {
    // TODO: FIX THIS (CHANGE BACK TO FALSE)
    private initialized: boolean = true

    private clientId: string
    private clientSecret: string
    private apiVersion: string
    private hostName: string

    private readonly logger = new Logger(CanvasNotificationService.name)

    constructor(
        identityHandler: ExternalIdentityHandler,
        subscriptionHandler: EventSubscriptionHandler,
        responseHandler: ExternalSystemResponseHandler,
        mappingHandler: EventMappingHandler,
        systemHandler: ExternalSystemHandler,
        configurationHandler: ExternalSystemConfigurationHandler,
        configurationHostHandler: ExternalSystemConfigurationHostHandler,
        stateHandler: StateHandler,
        private readonly externalSystemRepository: ExternalSystemRepository,
        private readonly configurationRepository: ExternalSystemConfigurationRepository,
        private readonly identityRepository: ExternalIdentityRepository,
        private readonly subscriptionRepository: EventSubscriptionRepository,
        private readonly userService: UserService,
        protected readonly eventService: EventService,
        protected readonly tokenHandler: CanvasTokenHandler,
        private readonly configService: ConfigService
    ) {
        super(
            identityHandler,
            subscriptionHandler,
            responseHandler,
            mappingHandler,
            systemHandler,
            configurationHandler,
            configurationHostHandler,
            stateHandler,
            'canvas'
        )

        this.clientId = this.configService.get<string>('CANVAS_CLIENT_ID')
        this.clientSecret = this.configService.get<string>(
            'CANVAS_CLIENT_SECRET'
        )
        this.apiVersion = this.configService.get<string>('CANVAS_API_VERSION')
        this.hostName = this.configService.get<string>('API_HOST')

        if (!this.clientId || !this.clientSecret) {
            throw new Error('No Canvas installation was defined.')
        }
    }

    async onModuleInit() {
        const initialized =
            this.configService.get<boolean>('CANVAS_INITIALIZED')

        if (!initialized) {
            await this.init()
            this.configService.set<boolean>('CANVAS_INITIALIZED', true)
        }
    }

    public async initiateAuthorization(userId: string): Promise<string | null> {
        if (!this.initialized)
            throw new Error(
                'Canvas service has not been initialized. initiateAuthorization'
            )

        const configuration = await this.getConfiguration(userId)
        if (!configuration)
            throw new Error(
                'The educational institute does not have a valid licence for the requested system.'
            )

        let externalIdentity = await this.getExternalIdentity(
            userId,
            configuration
        )
        if (!externalIdentity)
            throw new Error(
                'No external user account could be found for the specified user.'
            )

        externalIdentity = await this.identityRepository.updateLastUpdatedTime(
            externalIdentity.id
        )
        if (!externalIdentity) return null

        return (
            configuration.domain +
            `/login/oauth2/auth?` +
            `client_id=${this.clientId}&` +
            `redirect_uri=${this.hostName}/${this.apiVersion}/api/canvas/auth&` +
            `response_type=code&` +
            `state=${btoa(`${externalIdentity.configurationId}|${userId}|${externalIdentity.id}|${externalIdentity.lastUpdated.toISOString()}`)}`
        )
    }

    public async finalizeAuthorization(
        code: string,
        state: string
    ): Promise<void> {
        if (!this.initialized)
            throw new Error(
                'Canvas service has not been initialized. finalizeAuthorization'
            )

        const externalIdentity = await this.validateState(state)

        const configuration = await this.configurationRepository.findById(
            externalIdentity.configurationId
        )
        if (!configuration)
            throw new Error(
                'The educational institute does not have a valid licence for the requested system.'
            )

        const token = await this.tokenHandler.fetchAuthorizationToken(
            code,
            configuration.domain
        )
        // NOTE: tokens made in sitemap does not contain 'expires_in' field
        if (!token || !token['expires_in'])
            throw new Error('Token Authorization failed.')

        const expiryDate = new Date()
        expiryDate.setSeconds(expiryDate.getSeconds() + token['expires_in'])

        const savedToken = await this.tokenHandler.setToken(
            new ExternalIdentityTokenUpdateDto(
                externalIdentity.id,
                externalIdentity.configurationId,
                JSON.stringify(token),
                expiryDate
            )
        )
        if (!savedToken)
            throw new Error('Authentication did not finish successfully.')

        await this.identityRepository.updateExternalIdentity(
            externalIdentity.id,
            token['user']['global_id']
        )

        await this.sendWelcomeCard(configuration.id, externalIdentity.id)
    }

    public async isAuthorized(userId: string): Promise<boolean> {
        if (!this.initialized)
            throw new Error(
                'Canvas service has not been initialized. isAuthorized'
            )

        const configuration = await this.getConfiguration(userId)
        if (!configuration) return false

        const externalIdentity = await this.getExternalIdentity(
            userId,
            configuration
        )
        if (!externalIdentity) return false

        const token = await this.tokenHandler.getToken(
            externalIdentity.id,
            configuration.id
        )
        return token != null
    }

    public async sendAnnouncementComment(
        userId: string,
        courseId: string,
        discussionTopicId: string,
        comment: string
    ): Promise<boolean> {
        console.log('Searching for configuration...')
        const configuration = await this.getConfiguration(userId)
        if (!configuration) return false

        console.log('Configuration found! Searching for external identity...')
        const identity = await this.getExternalIdentity(userId, configuration)
        if (!identity) return false

        console.log('External identity found! Searching for token...')
        const token = await this.tokenHandler.getToken(
            identity.id,
            configuration.id
        )
        if (!token) return false

        console.log('Token found! Retrieving access token from token...')
        const accessToken = await this.getAccessToken(token)
        if (!accessToken) return false

        console.log('Access token retrieved! Posting submission comment...')
        const response = await fetch(
            `${configuration.domain}/api/v1/` +
                `courses/${courseId}/` +
                `discussion_topics/${discussionTopicId}/` +
                `entries?message=${encodeURIComponent(comment)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        if (!response.ok) {
            console.log(
                `Request did not finish successfully: ${response.status}`
            )
            return null
        }
        console.log('Submission comment posted!')
        return true
    }

    public async sendSubmissionComment(
        userId: string,
        courseId: string,
        assignmentId: string,
        comment: string
    ): Promise<boolean> {
        console.log('Searching for configuration...')
        const configuration = await this.getConfiguration(userId)
        if (!configuration) return false

        console.log('Configuration found! Searching for external identity...')
        const identity = await this.getExternalIdentity(userId, configuration)
        if (!identity) return false

        console.log('External identity found! Searching for token...')
        console.log(`${configuration.id} ${identity.id}`)
        const token = await this.tokenHandler.getToken(
            identity.id,
            configuration.id
        )
        if (!token) return false

        console.log('Token found! Retrieving access token from token...')
        const accessToken = await this.getAccessToken(token)
        if (!accessToken) return false

        console.log('Access token retrieved! Posting submission comment...')
        const response = await fetch(
            `${configuration.domain}/api/v1/` +
                `courses/${courseId}/` +
                `assignments/${assignmentId}/` +
                `submissions/${identity.externalId}?` +
                `comment[text_comment]=${encodeURIComponent(comment)}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        if (!response.ok) {
            console.log(
                `Request did not finish successfully: ${response.status}`
            )
            return null
        }
        console.log('Submission comment posted!')
        return true
    }

    private async sendWelcomeCard(
        externalSystemConfigurationId: string,
        externalIdentityId: string
    ): Promise<void> {
        const mapping = await this.getEventMapping(
            externalSystemConfigurationId,
            this.externalSystemName,
            'canvas_welcome'
        )
        if (!mapping) return

        await this.eventService.sendNotification(
            [externalIdentityId],
            mapping,
            {}
        )
    }

    protected async init() {
        const externalSystem = await this.externalSystemRepository.findByName(
            this.externalSystemName,
            true
        )
        if (!externalSystem) {
            Logger.error(
                `No external system with the name ${this.externalSystemName} found.`
            )
            return
        }

        externalSystem.externalSystemConfigurations =
            await this.configurationRepository.findManyByExternalSystemId(
                externalSystem.id,
                false,
                true
            )
        if (!externalSystem.externalSystemConfigurations) {
            Logger.error(
                `No data adapters found for the external system ${this.externalSystemName}.`
            )
            return
        }

        for (
            let index = 0;
            index < externalSystem.externalSystemConfigurations.length;
            index++
        ) {
            externalSystem.externalSystemConfigurations[
                index
            ].externalIdentities =
                await this.identityRepository.findManyByConfigurationId(
                    externalSystem.id,
                    true,
                    true
                )
            if (
                !externalSystem.externalSystemConfigurations[index]
                    .externalIdentities
            )
                return null
        }

        let initialized = await super.init(externalSystem)
        if (!initialized) {
            Logger.error(
                `Failed to initialize the external system ${this.externalSystemName}.`
            )
            return
        }

        console.log('base init finish')
        initialized = await this.tokenHandler.init(
            externalSystem.externalSystemConfigurations
        )
        if (!initialized) {
            Logger.error(
                `Failed to initialize the token handler for the external system ${this.externalSystemName}.`
            )
            return
        }
        console.log('init finish')
        this.initialized = true
    }

    private async getConfiguration(
        userId: string
    ): Promise<ExternalSystemConfigurationDto | null> {
        const adapter = await this.externalSystemRepository.findByName(
            this.externalSystemName
        )
        console.log(userId)
        const user = await this.userService.findOne(userId)
        if (!user || !adapter)
            throw new Error('No registration for the requested student exists.')

        return await this.configurationRepository.findByInstituteAndExternalSystem(
            user.instituteId,
            adapter.id,
            true
        )
    }

    private async getExternalIdentity(
        userId: string,
        configuration: ExternalSystemConfigurationDto
    ): Promise<ExternalIdentityDto | null> {
        let externalIdentity =
            await this.identityRepository.findByUserAndDataAdapter(
                userId,
                configuration.id
            )
        if (!externalIdentity)
            externalIdentity = await this.createExternalIdentity(
                userId,
                configuration.id,
                configuration.eventMappings
                    .filter((mapping) => mapping.isDefaultEnabled)
                    .map((mapping) => mapping.id)
            )
        if (!externalIdentity) return null
        return externalIdentity
    }

    public async getCanvasToken(userId: string): Promise<string | null> {
        if (!this.initialized)
            throw new Error(
                'Canvas service has not been initialized. getCanvasToken'
            )

        const configuration = await this.getConfiguration(userId)
        if (!configuration) return null

        const externalIdentity = await this.getExternalIdentity(
            userId,
            configuration
        )
        if (!externalIdentity) return null

        const token = await this.tokenHandler.getToken(
            externalIdentity.id,
            configuration.id
        )
        return token
    }

    private async createExternalIdentity(
        userId: string,
        configurationId: string,
        subscriptions: string[]
    ): Promise<ExternalIdentityDto | null> {
        const externalIdentity = await this.identityRepository.create(
            userId,
            configurationId
        )
        if (!externalIdentity) return null

        externalIdentity.subscriptions = []
        for (const subscription of subscriptions) {
            const newSubscription = await this.subscriptionRepository.create(
                subscription,
                externalIdentity.id
            )
            if (!newSubscription) continue
            externalIdentity.subscriptions.push(newSubscription)
        }

        const result = await super.insertExternalIdentity(
            externalIdentity.id,
            configurationId,
            externalIdentity.subscriptions.map(
                (subscription) => subscription.eventMappingId
            )
        )
        return result ? externalIdentity : null
    }

    private async validateState(
        state: string
    ): Promise<ExternalIdentityDto | null> {
        const decodedState = atob(state).split('|')
        if (decodedState.length != 4)
            throw new Error('Invalid state object provided.')

        const externalIdentity =
            await this.identityRepository.findByUserAndDataAdapter(
                decodedState[1],
                decodedState[0]
            )
        if (!externalIdentity || externalIdentity?.id != decodedState[2])
            throw new Error('Invalid state object provided.')

        const minutes = externalIdentity.lastUpdated.getMinutes()
        const expiryDate = new Date().setMinutes(minutes + 5)
        if (Date.now() >= expiryDate)
            throw new Error('Invalid state object provided.')

        const date = new Date(decodedState[3])
        if (!date || date?.getTime() !== externalIdentity.lastUpdated.getTime())
            throw new Error('Invalid state object provided.')
        return externalIdentity
    }

    protected async getAccessToken(token: string): Promise<string | null> {
        const parsedToken = await JSON.parse(token)
        const accessToken = parsedToken['access_token']
        const tokenType = parsedToken['token_type']
        if (!accessToken || !tokenType) return null
        return `${tokenType} ${accessToken}`
    }
}
