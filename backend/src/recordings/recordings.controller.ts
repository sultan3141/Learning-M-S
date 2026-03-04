import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    Param,
    Query,
    Patch,
    Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecordingsService } from './recordings.service';
import { JwtUser } from '../auth/jwt.strategy';
import { Request } from 'express';

interface AuthedRequest extends Request {
    user: JwtUser;
}

@Controller('recordings')
@UseGuards(AuthGuard('jwt'))
export class RecordingsController {
    constructor(private readonly recordings: RecordingsService) { }

    @Post()
    release(
        @Req() req: AuthedRequest,
        @Body('courseId') courseId: string,
        @Body('subjectId') subjectId: string,
        @Body('title') title: string,
        @Body('videoUrl') videoUrl: string,
        @Body('description') description?: string,
    ) {
        const { userId, role } = req.user;
        if (role !== 'TEACHER') {
            throw new Error('Only teachers can release recordings');
        }
        return this.recordings.releaseRecording(
            userId,
            courseId,
            subjectId,
            title,
            videoUrl,
            description,
        );
    }

    @Get()
    findAll(@Req() req: AuthedRequest, @Query('courseId') courseId: string) {
        if (!courseId) throw new Error('courseId is required');
        const { userId } = req.user;
        return this.recordings.listRecordings(userId, courseId);
    }

    @Patch(':id')
    update(
        @Req() req: AuthedRequest,
        @Param('id') id: string,
        @Body('title') title?: string,
        @Body('videoUrl') videoUrl?: string,
        @Body('description') description?: string,
    ) {
        const { userId, role } = req.user;
        if (role !== 'TEACHER') {
            throw new Error('Only teachers can update recordings');
        }
        return this.recordings.updateRecording(userId, id, { title, videoUrl, description });
    }

    @Delete(':id')
    delete(@Req() req: AuthedRequest, @Param('id') id: string) {
        const { userId, role } = req.user;
        if (role !== 'TEACHER') {
            throw new Error('Only teachers can delete recordings');
        }
        return this.recordings.deleteRecording(userId, id);
    }
}
