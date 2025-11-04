import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    await createExternalSystems()
    await createInstitutes()
    await createUsers()
    await createConfigurations()
    await createResponses()
    await createEventMappings()
}

const SYSTEM_IDS = {
    canvas: '00000000-0000-0000-0000-000000000001',
} as const

const CONFIGURATION_IDS = {
    canvas: '00000000-0000-0000-0000-000000000001',
} as const

const INSTITUTE_ID = '00000000-0000-0000-0000-000000000001'


async function createExternalSystems() {
    const created = await prisma.externalSystem.upsert({
        where: { id: SYSTEM_IDS.canvas },
        update: {},
        create: {
            id: SYSTEM_IDS.canvas,
            name: 'canvas',
            minimumVersion: '1',
        },
    })
    console.log(`External systems created:\r\n${created.name}`)
}

async function createInstitutes() {
    const institute = await prisma.institute.upsert({
        where: { id: INSTITUTE_ID },
        update: {},
        create: {
            id: INSTITUTE_ID,
            name: 'CY2',
        },
    })
    console.log(`Educational institutes created:\r\n${institute}`)
}

async function createUsers() {
    const user = await prisma.user.upsert({
        // INSERT AZURE OBJECT ID OF YOUR MICROSOFT ACCOUNT HERE (default: Emily Henderson)
        where: { id: 'a63d77ed-1fe7-42b0-8fde-243df9b83b6e' },
        update: {},
        create: {
            // INSERT AZURE OBJECT ID OF YOUR MICROSOFT ACCOUNT HERE (default: Emily Henderson)
            id: 'a63d77ed-1fe7-42b0-8fde-243df9b83b6e',
            instituteId: INSTITUTE_ID,
            isActive: true,
        },
    })
    console.log(`Users created:\r\n${user}`)
}

async function createConfigurations() {
    const configuration = await prisma.externalSystemConfiguration.upsert({
        where: { id: CONFIGURATION_IDS.canvas },
        update: {},
        create: {
            id: CONFIGURATION_IDS.canvas,
            externalSystemId: SYSTEM_IDS.canvas,
            instituteId: INSTITUTE_ID,
            domain: 'https://canvas.cy2.com/',
            notificationsEnabled: true,
            requestsEnabled: true,
            setupTimestamp: new Date(),
            lastUpdated: new Date(),
        },
    })
    console.log(`External system configurations created:\r\n${configuration.domain}`)
}

async function createResponses() {
    const grade = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_grade',
            displayName: '[Canvas] Grade published',
            description:
                'The response that is received from Canvas when a submission is graded.',
        },
    })

    const announcement = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_announcement',
            displayName: '[Canvas] Announcement received',
            description:
                'The response that is received from Canvas whenever an announcement has been published inside of a course.',
        },
    })

    const submissionReminder = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000003' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000003',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_submission_reminder',
            displayName: '[Canvas] Submission reminder',
            description:
                'The response that is received from Canvas whenever an assignment is due.',
        },
    })

    const welcome = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000004' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000004',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_welcome',
            displayName: '[Canvas] Account linked',
            description:
                'The response that the Student Companion app generates whenever a student links their Canvas account.',
        },
    })

    const submissionComment = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000005' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000005',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_submission_comment',
            displayName: '[Canvas] Submission comment received',
            description:
                'The response that is received from Canvas whenever an assignment submission receives a comment from a user besides the student.',
        },
    })
    console.log(
        `External system responses created:\r\n${[
            grade.displayName,
            announcement.displayName,
            submissionReminder.displayName,
            welcome.displayName,
            submissionComment.displayName,
        ].join('\r\n')}`
    )
}

async function createEventMappings() {
    const grade = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            externalSystemConfigurationId: CONFIGURATION_IDS.canvas,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000001',
            name: '[Canvas] Announcement received',
            description:
                'The Adaptive Card that is generated when a submission is graded within Canvas.',
            summary: 'A submission has been graded!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const announcement = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            externalSystemConfigurationId: CONFIGURATION_IDS.canvas,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000002',
            name: '[Canvas] Grade published',
            description:
                'The Adaptive Card that is generated when a course announcement is published within Canvas.',
            summary: 'An announcement has been posted!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const submissionReminder = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000003' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000003',
            externalSystemConfigurationId: CONFIGURATION_IDS.canvas,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000003',
            name: '[Canvas] Submission reminder',
            description:
                'The Adaptive Card that is generated when an assignment within Canvas is due.',
            summary: 'An assignment is due today!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const welcome = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000003' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000004',
            externalSystemConfigurationId: CONFIGURATION_IDS.canvas,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000004',
            name: '[Canvas] Account linked',
            description:
                'The Adaptive Card that is generated when a Canvas account has been linked to the Student Companion app.',
            summary: 'Canvas account linked successfully!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const submissionComment = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000005' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000005',
            externalSystemConfigurationId:
                '00000000-0000-0000-0000-000000000001',
            externalSystemResponseId: '00000000-0000-0000-0000-000000000005',
            name: '[Canvas] Submission comment',
            description:
                'The Adaptive Card that is generated when a comment has been posted to an assignment submission within Canvas.',
            summary: 'A comment has been posted!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })
    console.log(
            `Event mappings created:\r\n${[
                grade.name,
                announcement.name,
                submissionReminder.name,
                welcome.name,
                submissionComment.name,
            ].join('\r\n')}`
    )
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
