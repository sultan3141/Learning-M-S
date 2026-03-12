import { create } from 'zustand';
import { api } from '../config/api';

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    order: number;
}

export interface Subject {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    lessonCount: number;
    progress: number;
}

interface CourseState {
    enrolledCourses: Course[];
    loading: boolean;
    fetchEnrolledCourses: (token: string) => Promise<void>;
    getCourseDetails: (token: string, courseId: string) => Promise<any>;
    getCourseById: (courseId: string) => Course | undefined;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    enrolledCourses: [],
    loading: false,
    fetchEnrolledCourses: async (token) => {
        set({ loading: true });
        try {
            const res = await api.get('/courses/me/enrolled', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ enrolledCourses: res.data });
        } catch (err) {
            console.error('Failed to fetch enrolled courses:', err);
            set({ enrolledCourses: [] }); // Set empty array on error
        } finally {
            set({ loading: false });
        }
    },
    getCourseDetails: async (token, courseId) => {
        try {
            const res = await api.get(`/courses/${courseId}/tree`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error('Failed to fetch course details:', err);
            return null;
        }
    },
    getCourseById: (courseId) => {
        const state = get();
        return state.enrolledCourses.find(course => course.id === courseId);
    }
}));
