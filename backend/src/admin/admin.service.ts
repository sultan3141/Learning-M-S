import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalTeachers,
      approvedTeachers,
      pendingTeachers,
      totalStudents,
      totalCourses,
      publishedCourses,
      totalRecordings,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'TEACHER' } }),
      this.prisma.user.count({ where: { role: 'TEACHER', isTeacherApproved: true } }),
      this.prisma.user.count({ where: { role: 'TEACHER', isTeacherApproved: false } }),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.course.count(),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.recording.count(),
    ]);

    return {
      teachers: {
        total: totalTeachers,
        approved: approvedTeachers,
        pending: pendingTeachers,
      },
      students: totalStudents,
      courses: {
        total: totalCourses,
        published: publishedCourses,
      },
      recordings: totalRecordings,
    };
  }

  async listTeachers() {
    const teachers = await this.prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        email: true,
        fullName: true,
        isTeacherApproved: true,
        createdAt: true,
        taughtCourses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return teachers.map((t) => ({
      ...t,
      coursesCount: t.taughtCourses.length,
    }));
  }

  async approveTeacher(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.user.update({
      where: { id: teacherId },
      data: { isTeacherApproved: true },
    });
  }

  async suspendTeacher(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.user.update({
      where: { id: teacherId },
      data: { isTeacherApproved: false },
    });
  }

  async deleteTeacher(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    await this.prisma.user.delete({
      where: { id: teacherId },
    });

    return { message: 'Teacher deleted successfully' };
  }

  async registerTeacher(email: string, password: string, fullName: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ForbiddenException('Email already in use');
    }

    const argon2 = require('argon2');
    const passwordHash = await argon2.hash(password);

    const teacher = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'TEACHER',
        isTeacherApproved: true, // Admin-created teachers are auto-approved
      },
    });

    return {
      id: teacher.id,
      email: teacher.email,
      fullName: teacher.fullName,
      isTeacherApproved: teacher.isTeacherApproved,
    };
  }

  async getTeacherStudents(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Get all students enrolled in this teacher's courses
    const courses = await this.prisma.course.findMany({
      where: { teacherId },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                email: true,
                fullName: true,
                age: true,
                phoneNumber: true,
                interest: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // Flatten and deduplicate students
    const studentsMap = new Map();
    courses.forEach((course) => {
      course.enrollments.forEach((enrollment) => {
        if (!studentsMap.has(enrollment.student.id)) {
          studentsMap.set(enrollment.student.id, {
            ...enrollment.student,
            courses: [],
          });
        }
        studentsMap.get(enrollment.student.id).courses.push({
          id: course.id,
          title: course.title,
        });
      });
    });

    return Array.from(studentsMap.values());
  }

  async resetTeacherPassword(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Generate a random 8-character password
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';
    for (let i = 0; i < 8; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const argon2 = require('argon2');
    const passwordHash = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: teacherId },
      data: { passwordHash },
    });

    return {
      email: teacher.email,
      fullName: teacher.fullName,
      newPassword: newPassword,
    };
  }

  async listStudents() {
    return this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        email: true,
        fullName: true,
        age: true,
        phoneNumber: true,
        interest: true,
        createdAt: true,
        enrollments: {
          select: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listCourses() {
    return this.prisma.course.findMany({
      include: {
        teacher: {
          select: {
            fullName: true,
            email: true,
          },
        },
        subjects: {
          select: {
            id: true,
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
  }

  async listRecordings() {
    return this.prisma.recording.findMany({
      include: {
        subject: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
                teacher: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async deleteRecording(recordingId: string) {
    const recording = await this.prisma.recording.findUnique({
      where: { id: recordingId },
    });

    if (!recording) {
      throw new NotFoundException('Recording not found');
    }

    await this.prisma.recording.delete({
      where: { id: recordingId },
    });

    return { message: 'Recording deleted successfully' };
  }
}
