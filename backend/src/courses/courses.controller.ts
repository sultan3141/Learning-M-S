import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { JwtUser } from '../auth/jwt.strategy';
import { Req } from '@nestjs/common';

interface AuthedRequest extends Request {
  user: JwtUser;
}

interface CreateCourseDto {
  title: string;
  description?: string;
  categoryId?: string;
}

interface CreateSubjectDto {
  title: string;
  description?: string;
  order?: number;
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) { }

  @Get()
  listCourses(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.courses.listPublishedCourses(page, limit);
  }

  @Get(':id')
  getCourse(@Param('id') id: string) {
    return this.courses.getCourseOverview(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/tree')
  getCourseTree(@Param('id') id: string, @Req() req: AuthedRequest) {
    const { userId } = req.user;
    return this.courses.getCourseTree(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Req() req: AuthedRequest) {
    const { userId, role } = req.user;
    return this.courses.enrollInCourse(id, userId, role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/enrolled')
  listEnrolled(@Req() req: AuthedRequest) {
    const { userId } = req.user;
    return this.courses.listEnrolledCourses(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/teacher/students')
  getTeacherStudents(@Req() req: AuthedRequest) {
    const { userId, role } = req.user;
    if (role !== 'TEACHER') throw new Error('Forbidden');
    return this.courses.listTeacherStudents(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/teacher/me')
  getMyTeacherCourses(@Req() req: AuthedRequest) {
    const { userId, role } = req.user;
    if (role !== 'TEACHER') throw new Error('Forbidden');
    return this.courses.listTeacherCourses(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:courseId/students/:studentId')
  unenrollStudent(
    @Req() req: AuthedRequest,
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    const { userId, role } = req.user;
    if (role !== 'TEACHER') throw new Error('Forbidden');
    return this.courses.unenrollStudent(userId, courseId, studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCourse(@Req() req: AuthedRequest, @Body() dto: CreateCourseDto) {
    const { userId, role } = req.user;
    if (role !== 'TEACHER') throw new Error('Forbidden');
    return this.courses.createCourse(userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':courseId/subjects')
  createSubject(
    @Req() req: AuthedRequest,
    @Param('courseId') courseId: string,
    @Body() dto: CreateSubjectDto,
  ) {
    const { userId, role } = req.user;
    if (role !== 'TEACHER') throw new Error('Forbidden');
    return this.courses.createSubject(userId, courseId, dto);
  }
}

