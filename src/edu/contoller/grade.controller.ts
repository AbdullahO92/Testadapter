import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EduAdapterFactory } from '../edu.factory'

@ApiTags('edu')
@Controller({ path: 'edu/:studentId', version: '0.1' })
export class GradeController {
    constructor(private readonly eduAdapterFactory: EduAdapterFactory) {}

    @Get('grades')
    async getGrades(
        @Param('studentId') studentId: string,
        @Param('courseId') courseId: string
    ) {
        const grades = await this.eduAdapterFactory.getGrades(
            studentId,
            courseId
        )
        return grades
    }
}
