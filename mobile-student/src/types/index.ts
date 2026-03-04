export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  level: string;
  isPublished: boolean;
  teacher: User;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Subject {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPublished: boolean;
}

export interface LiveSession {
  id: string;
  courseId: string;
  teacherId: string;
  roomCode: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  startedAt?: string;
  endedAt?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  course: Course;
}

export interface StudentProgress {
  id: string;
  lessonId: string;
  completed: boolean;
  progress: number;
  lastAccessed: string;
}
