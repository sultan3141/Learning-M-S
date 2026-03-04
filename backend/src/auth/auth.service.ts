import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { UserRole } from '@prisma/client';

interface JwtPayload {
  sub: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) { }

  async registerStudent(email: string, password: string, fullName: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'STUDENT',
      },
    });
    return this.buildTokens(user.id, user.role);
  }

  async registerTeacher(
    email: string,
    password: string,
    fullName: string,
  ) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'TEACHER',
        isTeacherApproved: false,
      },
    });
    return this.buildTokens(user.id, user.role);
  }

  async registerByTeacher(
    fullName: string,
    age: number,
    phoneNumber: string,
    interest: string,
  ) {
    // Generate username: lowercase name + random suffix
    const baseUsername = fullName.toLowerCase().replace(/\s+/g, '.');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const email = `${baseUsername}.${randomSuffix}@school.com`;

    // Generate random 8-char password
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'STUDENT',
        age,
        phoneNumber,
        interest,
        mustChangePassword: true,
      },
    });

    return {
      id: user.id,
      username: email,
      password: password, // Return plain password once so teacher can give it to student
      fullName: user.fullName
    };
  }

  async changePassword(userId: string, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        mustChangePassword: false
      }
    });
    return { message: 'Password updated successfully' };
  }

  async updateStudent(studentId: string, data: { fullName?: string; age?: number; phoneNumber?: string; interest?: string }) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' },
    });

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: studentId },
      data: {
        fullName: data.fullName,
        age: data.age,
        phoneNumber: data.phoneNumber,
        interest: data.interest,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        phoneNumber: true,
        interest: true,
      },
    });

    return updated;
  }

  async resetStudentPassword(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' },
    });

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    // Generate new random password
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';
    for (let i = 0; i < 8; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const passwordHash = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: studentId },
      data: {
        passwordHash,
        mustChangePassword: true,
      },
    });

    return {
      username: student.email,
      password: newPassword,
      fullName: student.fullName,
    };
  }

  async deleteStudent(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' },
    });

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    // Delete the student (this will cascade delete related records)
    await this.prisma.user.delete({
      where: { id: studentId },
    });

    return { message: 'Student deleted successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.buildTokens(user.id, user.role);
  }

  private async buildTokens(userId: string, role: UserRole) {
    const payload: JwtPayload = { sub: userId, role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TTL_SECONDS || 900),
    });
    return { accessToken };
  }
}

