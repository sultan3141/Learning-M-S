import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, BookOpen, User, Plus } from 'lucide-react-native';
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../features/dashboard/HomeScreen';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';

import { DiscoverScreen } from '../features/discover/DiscoverScreen';

import { ProfileScreen } from '../features/profile/ProfileScreen';

// Placeholder components for other tabs
const PlaceholderScreen = ({ name }: { name: string }) => {
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    return (
        <View style={[styles.centered, { backgroundColor: COLORS.background }]}>
            <Text style={{ color: COLORS.text.primary }}>{name} Screen - W.I.P</Text>
        </View>
    );
};

const ProgressScreen = () => <PlaceholderScreen name="My Learning" />;

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    // Bottom tab padding needs to accommodate both iOS Home Indicator and Android Navbar
    const bottomPadding = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 16 : 12);
    const tabHeight = 60 + bottomPadding;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text.muted,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: tabHeight,
                        paddingBottom: bottomPadding,
                        backgroundColor: COLORS.card,
                        borderTopColor: COLORS.border,
                    }
                ],
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Compass color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Create"
                component={View} // Hidden component
                options={{
                    tabBarButton: (props: any) => {
                        const { delayLongPress, ...rest } = props;
                        return (
                            <TouchableOpacity
                                {...rest}
                                activeOpacity={0.8}
                                style={styles.plusButtonContainer}
                            >
                                <View style={styles.plusButton}>
                                    <Plus color="#FFFFFF" size={32} />
                                </View>
                            </TouchableOpacity>
                        );
                    },
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('CreateRoom' as any);
                    },
                })}
            />
            <Tab.Screen
                name="Learning"
                component={ProgressScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <BookOpen color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 8,
        elevation: 0,
        shadowColor: 'transparent',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: -4,
    },
    plusButtonContainer: {
        top: -24, // Lift the button up
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#00B884', // Matching the green in the image
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00B884',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 4,
        borderColor: '#FFFFFF', // White border to pop out from the tab bar
    },
});
