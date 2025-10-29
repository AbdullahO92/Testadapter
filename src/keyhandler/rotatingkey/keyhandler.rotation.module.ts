import { Global, Module } from '@nestjs/common'
import { RotatingKeyHandler } from './keyhandler.rotation'

@Global()
@Module({
    imports: [],
    exports: [RotatingKeyHandler],
    providers: [RotatingKeyHandler],
    controllers: [],
})
export class RotatingKeyHandlerModule {}
