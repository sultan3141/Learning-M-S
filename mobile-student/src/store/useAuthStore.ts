import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setLogoutFunction } from '../config/api';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    mustChangePassword?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                AsyncStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Inject the logout function into the centralized API client
setLogoutFunction(() => {
    useAuthStore.getState().logout();
});

