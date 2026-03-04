import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordingsService {
    constructor(private readonly prisma: PrismaService) { }

    async releaseRecording(
        teacherId: string,
        courseId: string,
        subjectId: string,
        title: string,
        videoUrl: string,
        description?: string,
    ) {
        // Verify teacher owns the course
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course || course.teacherId !== teacherId) {
            throw new ForbiddenException('You do not have permission to release recordings for this course');
        }

        // Verify subject exists in course
        const subject = await this.prisma.subject.findUnique({
            where: { id: subjectId, courseId },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found in this course');
        }

        return this.prisma.recording.create({
            data: {
                courseId,
                subjectId,
                title,
                videoUrl,
                description,
                youtubeVideoId: this.extractYoutubeId(videoUrl),
            },
        });
    }

    async listRecordings(userId: string, courseId: string) {
        // Validation: Verify course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Students can access all recordings, teachers can access their own
        // (We could add a role check here if we want to be stricter, 
        // but the requirement is global access for students)

        return this.prisma.recording.findMany({
            where: { courseId },
            include: {
                subject: { select: { title: true } },
            },
            orderBy: { recordedAt: 'desc' },
        });
    }

    async updateRecording(
        teacherId: string,
        recordingId: string,
        data: { title?: string; videoUrl?: string; description?: string },
    ) {
        // Verify recording exists and teacher owns the course
        const recording = await this.prisma.recording.findUnique({
            where: { id: recordingId },
            include: { 
                subject: {
                    include: {
                        course: true
                    }
                }
            },
        });

        if (!recording) {
            throw new NotFoundException('Recording not found');
        }

        // Check if teacher owns the course through subject
        const course = await this.prisma.course.findUnique({
            where: { id: recording.courseId },
        });

        if (!course || course.teacherId !== teacherId) {
            throw new ForbiddenException('You do not have permission to update this recording');
        }

        // Update recording
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.videoUrl !== undefined) {
            updateData.videoUrl = data.videoUrl;
            updateData.youtubeVideoId = this.extractYoutubeId(data.videoUrl);
        }

        return this.prisma.recording.update({
            where: { id: recordingId },
            data: updateData,
            include: {
                subject: { select: { title: true } },
            },
        });
    }

    async deleteRecording(teacherId: string, recordingId: string) {
        // Verify recording exists and teacher owns the course
        const recording = await this.prisma.recording.findUnique({
            where: { id: recordingId },
        });

        if (!recording) {
            throw new NotFoundException('Recording not found');
        }

        const course = await this.prisma.course.findUnique({
            where: { id: recording.courseId },
        });

        if (!course || course.teacherId !== teacherId) {
            throw new ForbiddenException('You do not have permission to delete this recording');
        }

        await this.prisma.recording.delete({
            where: { id: recordingId },
        });

        return { message: 'Recording deleted successfully' };
    }

    private extractYoutubeId(url: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}
