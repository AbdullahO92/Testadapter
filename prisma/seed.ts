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
    campusSolutions: '00000000-0000-0000-0000-000000000002',
} as const

const CONFIGURATION_IDS = {
    canvas: '00000000-0000-0000-0000-000000000001',
    campusSolutions: '00000000-0000-0000-0000-000000000002',
} as const

const INSTITUTE_ID = '00000000-0000-0000-0000-000000000001'


async function createExternalSystems() {
   // const created = await prisma.externalSystem.upsert({
        const canvas = await prisma.externalSystem.upsert({

            where: { id: SYSTEM_IDS.canvas },
        update: {},
        create: {
            id: SYSTEM_IDS.canvas,
            name: 'canvas',
            minimumVersion: '1',
        },
    })
   // console.log(`External systems created:\r\n${created.name}`)
    const campusSolutions = await prisma.externalSystem.upsert({
        where: { id: SYSTEM_IDS.campusSolutions },
        update: {},
        create: {
            id: SYSTEM_IDS.campusSolutions,
            name: 'campus-solutions',
            minimumVersion: '1',
        },
    })

    console.log(
        `External systems created:\r\n${[canvas.name, campusSolutions.name].join('\r\n')}`
    )
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
   // const configuration = await prisma.externalSystemConfiguration.upsert({
    const canvas = await prisma.externalSystemConfiguration.upsert({
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
   // console.log(`External system configurations created:\r\n${configuration.domain}`)
    const campusSolutions = await prisma.externalSystemConfiguration.upsert({
        where: { id: CONFIGURATION_IDS.campusSolutions },
        update: {},
        create: {
            id: CONFIGURATION_IDS.campusSolutions,
            externalSystemId: SYSTEM_IDS.campusSolutions,
            instituteId: INSTITUTE_ID,
            domain: 'https://campus-solutions.test/',
            notificationsEnabled: true,
            requestsEnabled: true,
            setupTimestamp: new Date(),
            lastUpdated: new Date(),
        },
    })

    console.log(
        `External system configurations created:\r\n${[
            canvas.domain,
            campusSolutions.domain,
        ].join('\r\n')}`
    )
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

    const results = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000010' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000010',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_results',
            displayName: '[Campus Solutions] Results',
            description:
                'The response received when overall student results are requested from Campus Solutions.',
        },
    })

    const filteredResults = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000011' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000011',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_filteredresults',
            displayName: '[Campus Solutions] Filtered results',
            description:
                'The response received when results are filtered in Campus Solutions.',
        },
    })

    const courseResults = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000012' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000012',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_courseresults',
            displayName: '[Campus Solutions] Course results',
            description:
                'The response received when course-specific results are requested from Campus Solutions.',
        },
    })

    const collegekaart = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000013' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000013',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_collegekaart',
            displayName: '[Campus Solutions] Collegekaart',
            description:
                'The response received when student card (collegekaart) details are requested from Campus Solutions.',
        },
    })

    const faciliteiten = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000014' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000014',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_faciliteiten',
            displayName: '[Campus Solutions] Faciliteiten',
            description:
                'The response received when campus facilities information is requested from Campus Solutions.',
        },
    })

    const pasfoto = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000015' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000015',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_pasfoto',
            displayName: '[Campus Solutions] Pasfoto',
            description:
                'The response received when a student photo is requested from Campus Solutions.',
        },
    })

    const classes = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000016' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000016',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_classes',
            displayName: '[Campus Solutions] Classes',
            description:
                'The response received when enrolled classes are requested from Campus Solutions.',
        },
    })

    const programs = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000017' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000017',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_programs',
            displayName: '[Campus Solutions] Programs',
            description:
                'The response received when academic programs are requested from Campus Solutions.',
        },
    })

    const allCourseResults = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000018' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000018',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_allcourseresults',
            displayName: '[Campus Solutions] All course results',
            description:
                'The response received when all course results are requested from Campus Solutions.',
        },
    })

    const resultsDeregisteredStudents = await prisma.externalSystemResponse.upsert({
        where: { id: '00000000-0000-0000-0000-000000000019' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000019',
            externalSystemId: SYSTEM_IDS.campusSolutions,
            internalName: 'campus_solutions_resultsderegisteredstudents',
            displayName: '[Campus Solutions] Deregistered students results',
            description:
                'The response received when results for deregistered students are requested from Campus Solutions.',
        },
    })
    console.log(
        `External system responses created:\r\n${[
            grade.displayName,
            announcement.displayName,
            submissionReminder.displayName,
            welcome.displayName,
            submissionComment.displayName,
            results.displayName,
            filteredResults.displayName,
            courseResults.displayName,
            collegekaart.displayName,
            faciliteiten.displayName,
            pasfoto.displayName,
            classes.displayName,
            programs.displayName,
            allCourseResults.displayName,
            resultsDeregisteredStudents.displayName,
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
    })

    const results = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000010' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000010',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000010',
            name: '[Campus Solutions] Results',
            description:
                'The Adaptive Card generated when overall student results are requested from Campus Solutions.',
            summary: 'Student results are available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const filteredResults = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000011' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000011',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000011',
            name: '[Campus Solutions] Filtered results',
            description:
                'The Adaptive Card generated when results are filtered by a specific criteria in Campus Solutions.',
            summary: 'Filtered results are available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const courseResults = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000012' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000012',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000012',
            name: '[Campus Solutions] Course results',
            description:
                'The Adaptive Card generated when course-specific results are requested from Campus Solutions.',
            summary: 'Course results are available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const collegekaart = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000013' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000013',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000013',
            name: '[Campus Solutions] Collegekaart',
            description:
                'The Adaptive Card generated when student card information is requested from Campus Solutions.',
            summary: 'Student card details are available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const faciliteiten = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000014' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000014',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000014',
            name: '[Campus Solutions] Faciliteiten',
            description:
                'The Adaptive Card generated when campus facilities information is requested from Campus Solutions.',
            summary: 'Facility information is available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const pasfoto = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000015' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000015',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000015',
            name: '[Campus Solutions] Pasfoto',
            description:
                'The Adaptive Card generated when a student photo is requested from Campus Solutions.',
            summary: 'A student photo is available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const classes = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000016' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000016',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000016',
            name: '[Campus Solutions] Classes',
            description:
                'The Adaptive Card generated when enrolled classes are requested from Campus Solutions.',
            summary: 'Class information is available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const programs = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000017' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000017',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000017',
            name: '[Campus Solutions] Programs',
            description:
                'The Adaptive Card generated when academic program information is requested from Campus Solutions.',
            summary: 'Program information is available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const allCourseResults = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000018' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000018',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000018',
            name: '[Campus Solutions] All course results',
            description:
                'The Adaptive Card generated when all course results are requested from Campus Solutions.',
            summary: 'All course results are available.',
            isEnabled: true,
            isDefaultEnabled: true,
            isTrigger: true,
        },
    })

    const resultsDeregisteredStudents = await prisma.eventMapping.upsert({
        where: { id: '00000000-0000-0000-0000-000000000019' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000019',
            externalSystemConfigurationId: CONFIGURATION_IDS.campusSolutions,
            externalSystemResponseId: '00000000-0000-0000-0000-000000000019',
            name: '[Campus Solutions] Deregistered students results',
            description:
                'The Adaptive Card generated when results for deregistered students are requested from Campus Solutions.',
            summary: 'Deregistered student results are available.',
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
                results.name,
                filteredResults.name,
                courseResults.name,
                collegekaart.name,
                faciliteiten.name,
                pasfoto.name,
                classes.name,
                programs.name,
                allCourseResults.name,
                resultsDeregisteredStudents.name,
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
