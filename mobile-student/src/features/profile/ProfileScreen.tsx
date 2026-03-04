import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LogOut, Settings, Award, Edit3, Bell, DownloadCloud, ChevronRight, User as UserIconLucide } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useThemeStore } from '../../store/useThemeStore';

export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, logout } = useAuthStore();
    const enrolledCourses = useCourseStore((state) => state.enrolledCourses);
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const completedCoursesCount = enrolledCourses.filter(c => c.progress === 100).length;

    const handlePersonalInformation = () => {
        Alert.alert(
            "Personal Information",
            `Name: ${user?.name}\nEmail: ${user?.email}\nPhone: +1 234 567 890`,
            [{ text: "OK" }]
        );
    };

    const handleCertificates = () => {
        if (completedCoursesCount === 0) {
            Alert.alert("My Certificates", "You haven't completed any courses yet. Keep learning to earn certificates!");
        } else {
            Alert.alert("My Certificates", `Congratulations! You have earned ${completedCoursesCount} certificates.`);
        }
    };

    const handleEditAvatar = () => {
        Alert.alert("Edit Avatar", "Avatar upload functionality would open here (mock).");
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    const renderSettingRow = (icon: React.ReactNode, title: string, subtitle?: string, onPress?: () => void) => (
        <TouchableOpacity style={[styles.settingRow, { borderBottomColor: COLORS.border }]} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.settingIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.15)' : COLORS.primaryLight }]}>
                {icon}
            </View>
            <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: COLORS.text.primary }]}>{title}</Text>
                {subtitle && <Text style={[styles.settingSubtitle, { color: COLORS.text.secondary }]}>{subtitle}</Text>}
            </View>
            <ChevronRight size={20} color={COLORS.text.muted} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* User Info Card */}
                <View style={[styles.profileCard, { backgroundColor: COLORS.card }]}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: COLORS.primaryDark }]}>
                            <Text style={styles.avatarText}>{user?.name.split(' ').map(n => n[0]).join('')}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.editAvatarBtn, { backgroundColor: COLORS.primary, borderColor: COLORS.card }]}
                            activeOpacity={0.8}
                            onPress={handleEditAvatar}
                        >
                            <Edit3 size={14} color={COLORS.text.inverse} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.userName, { color: COLORS.text.primary }]}>{user?.name}</Text>
                    <Text style={[styles.userEmail, { color: COLORS.text.secondary }]}>{user?.email}</Text>

                    <View style={[styles.statsContainer, { borderTopColor: COLORS.border }]}>
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: COLORS.text.primary }]}>{enrolledCourses.length}</Text>
                            <Text style={[styles.statLabel, { color: COLORS.text.secondary }]}>Courses</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: COLORS.text.primary }]}>{completedCoursesCount}</Text>
                            <Text style={[styles.statLabel, { color: COLORS.text.secondary }]}>Certificates</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Groups */}
                <View style={styles.settingsGroup}>
                    <Text style={[styles.groupTitle, { color: COLORS.text.muted }]}>Account Settings</Text>
                    <View style={[styles.groupContainer, { backgroundColor: COLORS.card }]}>
                        {renderSettingRow(<UserIcon color={COLORS.primary} />, 'Personal Information', 'Name, Email, Phone', handlePersonalInformation)}
                        {renderSettingRow(<Award size={20} color={COLORS.primary} />, 'My Certificates', 'View earned certificates', handleCertificates)}
                        {renderSettingRow(<Bell size={20} color={COLORS.primary} />, 'Notifications', 'Manage alerts and emails', () => Alert.alert("Notifications", "Notification settings toggled (mock)"))}
                    </View>
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={[styles.groupTitle, { color: COLORS.text.muted }]}>App Preferences</Text>
                    <View style={[styles.groupContainer, { backgroundColor: COLORS.card }]}>
                        {renderSettingRow(<DownloadCloud size={20} color={COLORS.primary} />, 'Offline Downloads', 'Manage storage (2.4 GB used)', () => Alert.alert("Storage", "Offline storage manager (mock)"))}
                        {renderSettingRow(<Settings size={20} color={COLORS.primary} />, 'General Settings', 'Dark mode, Language', () => navigation.navigate('GeneralSettings'))}
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={[styles.logoutButton, { backgroundColor: COLORS.card }]} onPress={handleLogout} activeOpacity={0.8}>
                    <LogOut size={20} color={COLORS.danger} />
                    <Text style={[styles.logoutText, { color: COLORS.danger }]}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

// Extracted User icon to avoid import conflict with react-native User object context if any
const UserIcon = ({ color }: { color: string }) => {
    return <UserIconLucide size={20} color={color} />
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 120, // Tab bar padding
        gap: SPACING.xl,
    },
    profileCard: {
        borderRadius: 24,
        padding: SPACING.xl,
        alignItems: 'center',
        ...SHADOWS.md,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 3,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        marginBottom: SPACING.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
    },
    settingsGroup: {
        gap: SPACING.sm,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    groupContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.lg,
        borderRadius: 16,
        gap: SPACING.sm,
        ...SHADOWS.sm,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        // color: '#EF4444', // Handled by dynamic style or kept in stylesheet if stable
    },
});
