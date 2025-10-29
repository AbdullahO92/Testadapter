import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { RequestContext } from './request.context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    constructor(private readonly requestContext: RequestContext) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.requestContext.setRequest(req)
        next()
    }
}
