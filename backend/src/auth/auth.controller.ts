import { Body, Controller, Post, UseGuards, Req, ForbiddenException, Patch, Param, Delete } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtUser } from './jwt.strategy';

interface AuthedRequest extends Request {
  user: JwtUser;
}

class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  fullName!: string;
}

class TeacherRegisterStudentDto {
  @IsNotEmpty()
  fullName!: string;

  @IsNotEmpty()
  age!: number;

  @IsNotEmpty()
  phoneNumber!: string;

  @IsNotEmpty()
  interest!: string;
}

class ChangePasswordDto {
  @MinLength(6)
  newPassword!: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('register/student')
  registerStudent(@Body() dto: RegisterDto) {
    return this.auth.registerStudent(dto.email, dto.password, dto.fullName);
  }

  @Post('register/teacher')
  registerTeacher(@Body() dto: RegisterDto) {
    return this.auth.registerTeacher(dto.email, dto.password, dto.fullName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('teacher/register-student')
  registerStudentByTeacher(@Req() req: AuthedRequest, @Body() dto: TeacherRegisterStudentDto) {
    const { role } = req.user;
    if (role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can register students');
    }
    return this.auth.registerByTeacher(dto.fullName, dto.age, dto.phoneNumber, dto.interest);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('teacher/student/:studentId')
  updateStudent(
    @Req() req: AuthedRequest,
    @Param('studentId') studentId: string,
    @Body() dto: Partial<TeacherRegisterStudentDto>
  ) {
    const { role } = req.user;
    if (role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can update students');
    }
    return this.auth.updateStudent(studentId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('teacher/student/:studentId')
  deleteStudent(@Req() req: AuthedRequest, @Param('studentId') studentId: string) {
    const { role } = req.user;
    if (role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can delete students');
    }
    return this.auth.deleteStudent(studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('teacher/student/:studentId/reset-password')
  resetStudentPassword(@Req() req: AuthedRequest, @Param('studentId') studentId: string) {
    const { role } = req.user;
    if (role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can reset student passwords');
    }
    return this.auth.resetStudentPassword(studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  changePassword(@Req() req: AuthedRequest, @Body() dto: ChangePasswordDto) {
    const { userId } = req.user;
    return this.auth.changePassword(userId, dto.newPassword);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}

