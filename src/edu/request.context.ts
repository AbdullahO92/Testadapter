import { Injectable, Scope } from '@nestjs/common'
import { Request } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
    private request: Request

    setRequest(req: Request) {
        this.request = req
    }

    getRequest(): Request {
        return this.request
    }
}
