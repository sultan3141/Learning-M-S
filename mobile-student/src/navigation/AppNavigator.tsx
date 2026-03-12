import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../features/auth/LoginScreen';
import { CourseDetailScreen } from '../features/learning/CourseDetailScreen';
import { VideoPlayerScreen } from '../features/learning/VideoPlayerScreen';
import { LiveJoinScreen } from '../features/live/LiveJoinScreen';
import { LiveRoomScreen } from '../features/live/LiveRoomScreen';
import { CreateRoomScreen } from '../features/live/CreateRoomScreen';
import { GeneralSettingsScreen } from '../features/profile/GeneralSettingsScreen';
import { ChangePasswordScreen } from '../features/auth/ChangePasswordScreen';
import { COLORS_LIGHT, COLORS_DARK } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';

export type RootStackParamList = {
    MainTabs: undefined;
    Login: undefined;
    CourseDetail: { courseId: string };
    VideoPlayer: { lessonId: string; courseId: string };
    LiveJoin: undefined;
    LiveRoom: { roomId: string };
    GeneralSettings: undefined;
    CreateRoom: undefined;
    ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { theme } = useThemeStore();
    const { isAuthenticated, user } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    // Optional: Add a check for hydration if you find it flickers
    // For now, we'll use isAuthenticated to decide the stack

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MainTabs"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: 'fade',
                }}
            >
                {/* Public and Unified Routes */}
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ gestureEnabled: false }}
                />

                {/* Auth */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
                />

                {/* Content */}
                <Stack.Screen
                    name="CourseDetail"
                    component={CourseDetailScreen}
                    options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                    name="VideoPlayer"
                    component={VideoPlayerScreen}
                    options={{ presentation: 'fullScreenModal', animation: 'fade' }}
                />
                <Stack.Screen
                    name="LiveJoin"
                    component={LiveJoinScreen}
                />
                <Stack.Screen
                    name="LiveRoom"
                    component={LiveRoomScreen}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                    name="GeneralSettings"
                    component={GeneralSettingsScreen}
                />
                <Stack.Screen
                    name="CreateRoom"
                    component={CreateRoomScreen}
                />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                    options={{ gestureEnabled: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
