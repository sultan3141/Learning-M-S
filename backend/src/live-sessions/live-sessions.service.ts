import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, LiveSessionStatus } from '@prisma/client';

@Injectable()
export class LiveSessionsService {
    constructor(private readonly prisma: PrismaService) { }

    async createSession(teacherId: string, courseId: string, subjectId?: string) {
        // Verify teacher owns the course
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { teacher: true },
        });

        if (!course || course.teacherId !== teacherId) {
            throw new ForbiddenException('You do not have permission to create a session for this course');
        }

        // Generate a unique 6-character room code
        let roomCode = '';
        let isUnique = false;
        while (!isUnique) {
            roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existing = await this.prisma.liveSession.findUnique({ where: { roomCode } });
            if (!existing) isUnique = true;
        }

        return this.prisma.liveSession.create({
            data: {
                teacherId,
                courseId,
                subjectId,
                roomCode,
                status: LiveSessionStatus.LIVE,
                startedAt: new Date(),
            },
        });
    }

    async listSessions(userId: string, role: UserRole) {
        if (role === UserRole.TEACHER) {
            return this.prisma.liveSession.findMany({
                where: { teacherId: userId, status: LiveSessionStatus.LIVE },
                include: {
                    course: { select: { title: true } },
                    subject: { select: { title: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        // For students, show all LIVE sessions
        return this.prisma.liveSession.findMany({
            where: {
                status: LiveSessionStatus.LIVE,
            },
            include: {
                course: { select: { title: true } },
                subject: { select: { title: true } },
                teacher: { select: { fullName: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async endSession(teacherId: string, sessionId: string) {
        const session = await this.prisma.liveSession.findUnique({
            where: { id: sessionId },
        });

        if (!session || session.teacherId !== teacherId) {
            throw new ForbiddenException('You do not have permission to end this session');
        }

        return this.prisma.liveSession.update({
            where: { id: sessionId },
            data: {
                status: LiveSessionStatus.ENDED,
                endedAt: new Date(),
            },
        });
    }
}
