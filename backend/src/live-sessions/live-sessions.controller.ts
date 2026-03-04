import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    Param,
    Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LiveSessionsService } from './live-sessions.service';
import { JwtUser } from '../auth/jwt.strategy';
import { Request } from 'express';

interface AuthedRequest extends Request {
    user: JwtUser;
}

@Controller('live-sessions')
@UseGuards(AuthGuard('jwt'))
export class LiveSessionsController {
    constructor(private readonly liveSessions: LiveSessionsService) { }

    @Post()
    create(
        @Req() req: AuthedRequest,
        @Body('courseId') courseId: string,
        @Body('subjectId') subjectId?: string,
    ) {
        const { userId, role } = req.user;
        if (role !== 'TEACHER') {
            throw new Error('Only teachers can create live sessions');
        }
        return this.liveSessions.createSession(userId, courseId, subjectId);
    }

    @Get()
    findAll(@Req() req: AuthedRequest) {
        const { userId, role } = req.user;
        return this.liveSessions.listSessions(userId, role);
    }

    @Patch(':id/end')
    end(@Param('id') id: string, @Req() req: AuthedRequest) {
        const { userId } = req.user;
        return this.liveSessions.endSession(userId, id);
    }
}
