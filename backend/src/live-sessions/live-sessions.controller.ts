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
export class LiveSessionsController {
    constructor(private readonly liveSessions: LiveSessionsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Req() req: AuthedRequest,
        @Body('courseId') courseId?: string,
        @Body('subjectId') subjectId?: string,
        @Body('topic') topic?: string,
        @Body('subtopic') subtopic?: string,
    ) {
        const { userId, role } = req.user;
        if (role !== 'TEACHER') {
            throw new Error('Only teachers can create live sessions');
        }
        return this.liveSessions.createSession(userId, courseId, subjectId, topic, subtopic);
    }

    @Get('public')
    findPublic() {
        return this.liveSessions.listPublicSessions();
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Req() req: AuthedRequest) {
        const { userId, role } = req.user;
        return this.liveSessions.listSessions(userId, role);
    }

    @Patch(':id/end')
    @UseGuards(AuthGuard('jwt'))
    end(@Param('id') id: string, @Req() req: AuthedRequest) {
        const { userId } = req.user;
        return this.liveSessions.endSession(userId, id);
    }

    @Post(':id/join')
    @UseGuards(AuthGuard('jwt'))
    getJoinToken(@Param('id') id: string, @Req() req: AuthedRequest) {
        const { userId, role } = req.user;
        const user = req.user as any;
        const userName = user.fullName || user.email || 'User';
        return this.liveSessions.getJoinToken(userId, userName, id, role);
    }
}
