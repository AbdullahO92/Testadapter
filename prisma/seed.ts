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
    campusSolutions: '00000000-0000-0000-0000-000000000010',
} as const

const CONFIGURATION_IDS = {
    canvas: '00000000-0000-0000-0000-000000000001',
    campusSolutions: '00000000-0000-0000-0000-000000000010',
} as const

const INSTITUTE_ID = '00000000-0000-0000-0000-000000000001'

async function createExternalSystems() {
    const created: string[] = []

    const systems = [
        {
            id: SYSTEM_IDS.canvas,
            name: 'canvas',
            minimumVersion: '1',
        },
        {
            id: SYSTEM_IDS.campusSolutions,
            name: 'campus-solutions',
            minimumVersion: '1',
        },
    ]

    for (const system of systems) {
        const result = await prisma.externalSystem.upsert({
            where: { id: system.id },
            update: {},
            create: system,
        })
        created.push(result.name)
    }

    console.log(`External systems created:\r\n${created.join('\r\n')}`)
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
    const configurations = [
        {
            id: CONFIGURATION_IDS.canvas,
            externalSystemId: SYSTEM_IDS.canvas,
            instituteId: INSTITUTE_ID,
            domain: 'https://canvas.cy2.com/',
            notificationsEnabled: true,
            requestsEnabled: true,
            setupTimestamp: new Date(),
            lastUpdated: new Date(),
        },
        {
            id: CONFIGURATION_IDS.campusSolutions,
            externalSystemId: SYSTEM_IDS.campusSolutions,
            instituteId: INSTITUTE_ID,
            domain: 'https://campus.example.edu/',
            notificationsEnabled: true,
            requestsEnabled: false,
            setupTimestamp: new Date(),
            lastUpdated: new Date(),
        },
    ]

    const domains: string[] = []

    for (const config of configurations) {
        const result = await prisma.externalSystemConfiguration.upsert({
            where: { id: config.id },
            update: {},
            create: config,
        })
        domains.push(result.domain)
    }

    console.log(
        `External system configurations created:\r\n${domains.join('\r\n')}`
    )
}

async function createResponses() {
    const responses = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_grade',
            displayName: '[Canvas] Grade published',
            description:
                'The response that is received from Canvas when a submission is graded.',
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_announcement',
            displayName: '[Canvas] Announcement received',
            description:
                'The response that is received from Canvas whenever an announcement has been published inside of a course.',
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_submission_reminder',
            displayName: '[Canvas] Submission reminder',
            description:
                'The response that is received from Canvas whenever an assignment is due.',
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_welcome',
            displayName: '[Canvas] Account linked',
            description:
                'The response that the Student Companion app generates whenever a student links their Canvas account.',
        },
        {
            id: '00000000-0000-0000-0000-000000000005',
            externalSystemId: SYSTEM_IDS.canvas,
            internalName: 'canvas_submission_comment',
            displayName: '[Canvas] Submission comment received',
            description:
                'The response that is received from Canvas whenever an assignment submission receives a comment from a user besides the student.',
        },
        {
            id: '00000000-0000-0000-0000-000000000101',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_schedule_change',
            displayName: '[Campus Solutions] Schedule change',
            description:
                'Triggered when a course meeting time, location, or instructor changes in Campus Solutions.',
        },
        {
            id: '00000000-0000-0000-0000-000000000102',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_grade_posted',
            displayName: '[Campus Solutions] Grade posted',
            description:
                'Created when a final grade is released in Campus Solutions.',
        },
        {
            id: '00000000-0000-0000-0000-000000000103',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_financial_hold',
            displayName: '[Campus Solutions] Financial hold',
            description:
                'Generated when a student account gets a financial hold.',
        },
        {
            id: '00000000-0000-0000-0000-000000000104',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_enrollment_deadline',
            displayName: '[Campus Solutions] Enrollment deadline',
            description:
                'Sent when an important enrollment deadline approaches.',
        },
    ]

    const created: string[] = []

    for (const response of responses) {
        const result = await prisma.externalSystemResponse.upsert({
            where: { id: response.id },
            update: {},
            create: response,
        })
        created.push(result.displayName)
    }

    console.log(
        `External system responses created:\r\n${created.join('\r\n')}`
    )
}

async function createEventMappings() {
    const mappings = [
        {
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
        {
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
        {
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
        {
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
        {
            id: '00000000-0000-0000-0000-000000000005',
            externalSystemConfigurationId: CONFIGURATION_IDS.canvas,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000005',
            name: '[Canvas] Submission comment',
            description:
                'The Adaptive Card that is generated when a comment has been posted to an assignment submission within Canvas.',
            summary: 'A comment has been posted!',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000201',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000101',
            name: '[Campus Solutions] Schedule change',
            description:
                'Generated when Campus Solutions updates the schedule for a course.',
            summary: 'A course schedule changed.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000202',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000102',
            name: '[Campus Solutions] Grade posted',
            description:
                'The Adaptive Card that is generated when a final grade is posted in Campus Solutions.',
            summary: 'A new grade is available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000203',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000103',
            name: '[Campus Solutions] Financial hold',
            description:
                'The Adaptive Card that is generated when Campus Solutions applies a financial hold.',
            summary: 'A financial hold needs attention.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000204',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000104',
            name: '[Campus Solutions] Enrollment deadline',
            description:
                'The Adaptive Card that is generated when an enrollment deadline is close.',
            summary: 'An enrollment deadline is coming up.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    ]

    const created: string[] = []

    for (const mapping of mappings) {
        const result = await prisma.eventMapping.upsert({
            where: { id: mapping.id },
            update: {},
            create: mapping,
        })
        created.push(result.name)
    }

    console.log(`Event mappings created:\r\n${created.join('\r\n')}`)
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
