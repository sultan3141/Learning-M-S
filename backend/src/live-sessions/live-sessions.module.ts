import { Module } from '@nestjs/common';
import { LiveSessionsService } from './live-sessions.service';
import { LiveSessionsController } from './live-sessions.controller';
import { LiveKitModule } from '../livekit/livekit.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule, LiveKitModule],
    controllers: [LiveSessionsController],
    providers: [LiveSessionsService],
    exports: [LiveSessionsService],
})
export class LiveSessionsModule { }
