import { useAuthStore } from '../store/useAuthStore';

export const useUserRole = () => {
    const user = useAuthStore((state) => state.user);
    return user?.role || null;
};

export const isAdmin = (role: string | null): boolean => {
    return role === 'ADMIN';
};

export const isTeacher = (role: string | null): boolean => {
    return role === 'TEACHER';
};
