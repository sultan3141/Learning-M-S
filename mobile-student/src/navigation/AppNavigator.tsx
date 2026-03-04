import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen } from '../features/auth/RegisterScreen';
import { CourseDetailScreen } from '../features/learning/CourseDetailScreen';
import { VideoPlayerScreen } from '../features/learning/VideoPlayerScreen';
import { LiveJoinScreen } from '../features/live/LiveJoinScreen';
import { LiveRoomScreen } from '../features/live/LiveRoomScreen';
import { CreateRoomScreen } from '../features/live/CreateRoomScreen';
import { GeneralSettingsScreen } from '../features/profile/GeneralSettingsScreen';
import { ChangePasswordScreen } from '../features/auth/ChangePasswordScreen';
import { COLORS_LIGHT, COLORS_DARK } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
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
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login" // Start on Login for testing
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: 'fade', // Smoother transition for root stack
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ gestureEnabled: false }} // Prevent swiping back to auth
                />
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
                    options={{ gestureEnabled: false }} // Prevent swiping back accidentally
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
