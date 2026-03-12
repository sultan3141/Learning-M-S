import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, LiveSessionStatus } from '@prisma/client';
import { LiveKitService } from '../livekit/livekit.service';

@Injectable()
export class LiveSessionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly livekit: LiveKitService,
    ) { }

    async createSession(teacherId: string, courseId?: string, subjectId?: string, topic?: string, subtopic?: string) {
        let course = null;
        if (courseId) {
            // Verify teacher owns the course
            course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: { teacher: true },
            });

            if (!course || course.teacherId !== teacherId) {
                throw new ForbiddenException('You do not have permission to create a session for this course');
            }
        }

        // Generate a unique 6-character room code
        let roomCode = '';
        let isUnique = false;
        while (!isUnique) {
            roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existing = await this.prisma.liveSession.findUnique({ where: { roomCode } });
            if (!existing) isUnique = true;
        }

        // Create LiveKit room if configured
        let livekitRoom = null;
        if (this.livekit.isConfigured()) {
            try {
                livekitRoom = await this.livekit.createRoom(roomCode, {
                    courseId: courseId || null,
                    subjectId,
                    teacherId,
                    courseTitle: course ? course.title : topic || 'Live Class',
                });
            } catch (error) {
                console.error('Failed to create LiveKit room:', error);
                // Continue without LiveKit if it fails
            }
        }

        const session = await this.prisma.liveSession.create({
            data: {
                teacherId,
                courseId,
                subjectId,
                topic,
                subtopic,
                roomCode,
                status: LiveSessionStatus.LIVE,
                startedAt: new Date(),
            },
        });

        return {
            ...session,
            livekitUrl: this.livekit.isConfigured() ? this.livekit.getLiveKitUrl() : null,
            livekitConfigured: this.livekit.isConfigured(),
        };
    }

    async getJoinToken(userId: string, userName: string, sessionId: string, role: UserRole) {
        const session = await this.prisma.liveSession.findFirst({
            where: {
                OR: [
                    { id: sessionId },
                    { roomCode: sessionId.toUpperCase() }
                ]
            },
            include: {
                course: true,
                teacher: true,
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.status !== LiveSessionStatus.LIVE) {
            throw new BadRequestException('Session is not live');
        }

        if (!this.livekit.isConfigured()) {
            throw new BadRequestException('LiveKit is not configured');
        }

        // Generate token based on role
        let token: string;
        if (role === UserRole.TEACHER && session.teacherId === userId) {
            token = await this.livekit.generateTeacherToken(
                session.roomCode,
                userName,
                userId,
            );
        } else {
            // Verify student enrollment
            // Check if student is enrolled in the session's course OR in ANY course of this teacher
            const enrollments = await this.prisma.enrollment.findMany({
                where: {
                    studentId: userId,
                    course: { teacherId: session.teacherId }
                }
            });

            if (enrollments.length === 0) {
                throw new ForbiddenException('You must be enrolled in one of this teacher\'s courses to join the live session');
            }

            token = await this.livekit.generateToken(
                session.roomCode,
                userName,
                userId,
                { role: 'student' },
            );
        }

        return {
            token,
            url: this.livekit.getLiveKitUrl(),
            roomName: session.roomCode,
            session: {
                id: session.id,
                courseTitle: session.course?.title || session.topic || 'Live Class',
                teacherName: session.teacher.fullName,
            },
        };
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

        // For students, show ONLY sessions for courses they are enrolled in
        const enrollments = await this.prisma.enrollment.findMany({
            where: { studentId: userId },
            select: { course: { select: { teacherId: true } } }
        });
        const enrolledTeacherIds = Array.from(new Set(enrollments.map(e => e.course.teacherId)));

        return this.prisma.liveSession.findMany({
            where: {
                status: LiveSessionStatus.LIVE,
                teacherId: { in: enrolledTeacherIds }
            },
            include: {
                course: { select: { title: true } },
                subject: { select: { title: true } },
                teacher: { select: { fullName: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async listPublicSessions() {
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
