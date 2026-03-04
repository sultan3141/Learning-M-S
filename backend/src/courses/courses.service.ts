import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) { }

  async listPublishedCourses(page = 1, limit = 10) {
    const take = Math.min(limit, 50);
    const skip = (page - 1) * take;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where: { isPublished: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            select: { id: true, fullName: true },
          },
          category: {
            select: { id: true, name: true },
          },
          subjects: {
            select: { id: true },
          },
        },
      }),
      this.prisma.course.count({ where: { isPublished: true } }),
    ]);

    return {
      items: items.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        thumbnail: c.thumbnail,
        teacherName: c.teacher.fullName,
        category: c.category?.name ?? null,
        lessonCount: c.subjects.length,
        createdAt: c.createdAt,
      })),
      page,
      total,
      pageSize: take,
    };
  }

  async getCourseOverview(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        teacher: { select: { id: true, fullName: true, avatar: true } },
        category: { select: { id: true, name: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async getCourseTree(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        subjects: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
              include: {
                progress: {
                  where: { studentId },
                  select: { completed: true, progress: true },
                },
              },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      subjects: course.subjects.map((s) => ({
        id: s.id,
        title: s.title,
        order: s.order,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          order: l.order,
          completed: l.progress[0]?.completed ?? false,
          progressPercent: l.progress[0]?.progress ?? 0,
        })),
      })),
    };
  }

  async enrollInCourse(courseId: string, studentId: string, role: UserRole) {
    if (role !== 'STUDENT') {
      throw new NotFoundException(); // hide course existence for non-students
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });
    if (!course) throw new NotFoundException('Course not found');

    const enrollment = await this.prisma.enrollment.upsert({
      where: {
        courseId_studentId: { courseId, studentId },
      },
      update: {},
      create: {
        courseId,
        studentId,
      },
      include: {
        course: true,
      },
    });

    return enrollment;
  }

  async listTeacherCourses(teacherId: string) {
    return this.prisma.course.findMany({
      where: { teacherId },
      include: {
        subjects: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listEnrolledCourses(studentId: string) {
    // Requirement: All students access all courses.
    // Instead of filtering by Enrollment, we return all published courses.
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
      include: {
        subjects: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail,
      enrolledAt: c.createdAt, // Using createdAt as dummy enrollment date
      lessonCount: c.subjects.length,
    }));
  }

  async listTeacherStudents(teacherId: string) {
    // Get all students registered by this teacher
    // We'll track this by checking who created the student account
    // For now, return all students since teachers register them
    const students = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        age: true,
        phoneNumber: true,
        interest: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                teacherId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter to only show students enrolled in this teacher's courses
    // or all students if teacher has no courses yet
    const teacherCourses = await this.prisma.course.findMany({
      where: { teacherId },
      select: { id: true },
    });

    const teacherCourseIds = teacherCourses.map((c) => c.id);

    return students.map((student) => {
      const enrolledCourses = student.enrollments
        .filter((e) => teacherCourseIds.includes(e.course.id))
        .map((e) => ({
          courseId: e.course.id,
          courseTitle: e.course.title,
          enrolledAt: e.createdAt,
        }));

      return {
        studentId: student.id,
        fullName: student.fullName,
        email: student.email,
        avatar: student.avatar,
        age: student.age,
        phoneNumber: student.phoneNumber,
        interest: student.interest,
        createdAt: student.createdAt,
        courses: enrolledCourses,
        // For backward compatibility, include first course info
        courseId: enrolledCourses[0]?.courseId,
        courseTitle: enrolledCourses[0]?.courseTitle,
        enrolledAt: enrolledCourses[0]?.enrolledAt,
      };
    });
  }

  async unenrollStudent(teacherId: string, courseId: string, studentId: string) {
    // Verify the teacher owns the course
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, teacherId },
    });
    if (!course) {
      throw new Error('Course not found or you do not have permission');
    }

    return this.prisma.enrollment.delete({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
    });
  }

  async createCourse(teacherId: string, dto: { title: string; description?: string; categoryId?: string }) {
    const course = await this.prisma.course.create({
      data: {
        teacherId,
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        isPublished: true, // Auto-publish for simplicity
      },
      include: {
        subjects: true,
      },
    });
    return course;
  }

  async createSubject(teacherId: string, courseId: string, dto: { title: string; description?: string; order?: number }) {
    // Verify the teacher owns the course
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, teacherId },
    });
    if (!course) {
      throw new ForbiddenException('Course not found or you do not have permission');
    }

    // Get the next order number if not provided
    let order = dto.order;
    if (order === undefined) {
      const lastSubject = await this.prisma.subject.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });
      order = (lastSubject?.order ?? -1) + 1;
    }

    const subject = await this.prisma.subject.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description,
        order,
      },
    });
    return subject;
  }
}