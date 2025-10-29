import { HttpException, HttpStatus } from '@nestjs/common'
import { Grades, IEduAdapter } from '../adapter'

class PSCSAdapter implements IEduAdapter {
    async getGrades(studentId: string, courseId?: string): Promise<Grades> {
        throw new HttpException(
            'pscs getGrades Method not implemented.',
            HttpStatus.NOT_IMPLEMENTED
        )
    }
}

export default PSCSAdapter
