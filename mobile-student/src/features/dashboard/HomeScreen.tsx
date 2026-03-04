import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';

import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS_LIGHT, COLORS_DARK } from '../../constants/theme';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user, token } = useAuthStore();
    const { enrolledCourses, fetchEnrolledCourses, loading } = useCourseStore();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    React.useEffect(() => {
        if (token) {
            fetchEnrolledCourses(token);
        }
    }, [token]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Use the first available course as the featured one
    const featuredCourse = enrolledCourses[0];

    return (
        <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={[TYPOGRAPHY.h1, { color: COLORS.text.primary }]}>
                        {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Student'}!
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: COLORS.text.secondary }]}>
                        Ready to learn something new today?
                    </Text>
                </View>

                {/* Featured Course Banner */}
                {featuredCourse && (
                    <View style={[styles.bannerContainer, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}>
                        <LinearGradient
                            colors={theme === 'dark' ? ['#1E1B4B', '#1E293B'] : ['#F5F7FF', '#FFFFFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerContent}>
                                <View style={styles.bannerTextWrapper}>
                                    <View style={styles.bannerTag}>
                                        <Text style={[styles.bannerTagText, { color: COLORS.primary }]}>FEATURED COURSE</Text>
                                    </View>
                                    <Text style={[styles.bannerTitle, { color: COLORS.text.primary }]}>{featuredCourse.title}</Text>
                                    <View style={styles.bannerProgressRow}>
                                        <Text style={[styles.bannerProgressText, { color: COLORS.text.primary }]}>
                                            {featuredCourse.lessonCount} Lessons Available
                                        </Text>
                                    </View>
                                </View>
                                <Button
                                    title="View"
                                    onPress={() => navigation.navigate('CourseDetail', { courseId: featuredCourse.id })}
                                    style={styles.bannerButton}
                                    variant="primary"
                                />
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {/* Today's Focus / Recommendations */}
                <View style={styles.sectionHeader}>
                    <Text style={[TYPOGRAPHY.h3, { color: COLORS.text.primary }]}>All Courses</Text>
                    <TouchableOpacity onPress={() => (navigation as any).navigate('Discovery')}>
                        <Text style={[styles.sectionAction, { color: COLORS.primary }]}>Discover more</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    {enrolledCourses.slice(0, 4).map((course) => (
                        <Card
                            key={course.id}
                            variant="small"
                            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                            style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border } as ViewStyle}
                        >
                            <Card.Tag textColor={COLORS.primary}>Course</Card.Tag>
                            <Card.Title variant="small" color={COLORS.text.primary}>{course.title}</Card.Title>
                            <Text style={[styles.meta, { color: COLORS.text.secondary }]}>
                                {course.lessonCount} Lessons
                            </Text>
                        </Card>
                    ))}
                </View>

                {enrolledCourses.length === 0 && !loading && (
                    <View style={styles.emptyState}>
                        <Text style={{ color: COLORS.text.secondary }}>No courses available yet.</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    headerSubtitle: {
        ...TYPOGRAPHY.body2,
        marginTop: 4,
    },
    bannerContainer: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: SPACING.xl,
        ...SHADOWS.sm,
    },
    bannerGradient: {
        padding: SPACING.lg,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerTextWrapper: {
        flex: 1,
        marginRight: SPACING.md,
    },
    bannerTag: {
        marginBottom: 8,
    },
    bannerTagText: {
        ...TYPOGRAPHY.meta,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
    bannerTitle: {
        ...TYPOGRAPHY.h3,
        fontSize: 18,
    },
    bannerProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    bannerProgressText: {
        ...TYPOGRAPHY.meta,
        fontWeight: '700',
    },
    bannerButton: {
        minWidth: 80,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },
    sectionAction: {
        ...TYPOGRAPHY.meta,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    meta: {
        ...TYPOGRAPHY.meta,
        marginTop: 4,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    }
});
