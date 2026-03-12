import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { JwtUser } from '../auth/jwt.strategy';
import { Request } from 'express';

interface AuthedRequest extends Request {
  user: JwtUser;
}

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // Middleware to check admin role
  private checkAdmin(role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  @Get('dashboard/stats')
  getDashboardStats(@Req() req: AuthedRequest) {
    this.checkAdmin(req.user.role);
    return this.admin.getDashboardStats();
  }

  @Get('teachers')
  listTeachers(@Req() req: AuthedRequest) {
    this.checkAdmin(req.user.role);
    return this.admin.listTeachers();
  }

  @Post('teachers')
  registerTeacher(
    @Req() req: AuthedRequest,
    @Body() body: { email: string; password: string; fullName: string },
  ) {
    this.checkAdmin(req.user.role);
    return this.admin.registerTeacher(body.email, body.password, body.fullName);
  }

  @Get('teachers/:id/students')
  getTeacherStudents(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.getTeacherStudents(id);
  }

  @Patch('teachers/:id/reset-password')
  resetTeacherPassword(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.resetTeacherPassword(id);
  }

  @Patch('teachers/:id/approve')
  approveTeacher(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.approveTeacher(id);
  }

  @Patch('teachers/:id/suspend')
  suspendTeacher(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.suspendTeacher(id);
  }

  @Delete('teachers/:id')
  deleteTeacher(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.deleteTeacher(id);
  }

  @Get('students')
  listStudents(@Req() req: AuthedRequest) {
    this.checkAdmin(req.user.role);
    return this.admin.listStudents();
  }

  @Get('courses')
  listCourses(@Req() req: AuthedRequest) {
    this.checkAdmin(req.user.role);
    return this.admin.listCourses();
  }

  @Delete('courses/:id')
  deleteCourse(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.deleteCourse(id);
  }

  @Get('recordings')
  listRecordings(@Req() req: AuthedRequest) {
    this.checkAdmin(req.user.role);
    return this.admin.listRecordings();
  }

  @Delete('recordings/:id')
  deleteRecording(@Req() req: AuthedRequest, @Param('id') id: string) {
    this.checkAdmin(req.user.role);
    return this.admin.deleteRecording(id);
  }
}
