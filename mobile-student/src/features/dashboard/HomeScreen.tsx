import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ViewStyle, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PlayCircle, MoonStar, BookOpen, GraduationCap } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';

import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS_LIGHT, COLORS_DARK } from '../../constants/theme';
import { api } from '../../config/api';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user, token, isAuthenticated } = useAuthStore();
    const { enrolledCourses, fetchEnrolledCourses, loading } = useCourseStore();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const [liveSessions, setLiveSessions] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetchEnrolledCourses(token);
        }
        fetchLiveSessions();
    }, [token]);

    const fetchLiveSessions = async () => {
        try {
            const url = token ? '/live-sessions' : '/live-sessions/public';
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await api.get(url, { headers });
            setLiveSessions(response.data);
        } catch (err) {
            console.error('Failed to fetch live sessions:', err);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Use the first available course as the featured one
    const featuredCourse = enrolledCourses && enrolledCourses.length > 0 ? enrolledCourses[0] : null;

    return (
        <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Text style={[styles.brandName, { color: COLORS.primary }]}>Markazul Furqaan</Text>
                    </View>
                    <Text style={[TYPOGRAPHY.h1, { color: COLORS.text.primary, marginTop: SPACING.xs }]}>
                        {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Student'}!
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: COLORS.text.secondary }]}>
                        Continue your Quran learning journey today.
                    </Text>
                </View>

                {/* Featured Course Banner */}
                {featuredCourse && (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('CourseDetail', { courseId: featuredCourse.id })}
                        style={[styles.bannerContainer, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}
                    >
                        <Image
                            source={{ uri: featuredCourse.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop' }}
                            style={styles.bannerImage}
                        />
                        <LinearGradient
                            colors={['rgba(15, 23, 42, 0.1)', 'rgba(15, 23, 42, 0.8)']}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerContent}>
                                <View style={styles.bannerTag}>
                                    <Text style={styles.bannerTagText}>CONTINUE LEARNING</Text>
                                </View>
                                <Text style={styles.bannerTitle} numberOfLines={2}>{featuredCourse.title}</Text>
                                <View style={styles.bannerMeta}>
                                    <PlayCircle color="white" size={16} />
                                    <Text style={styles.bannerMetaText}>{featuredCourse.lessonCount} Lessons Available</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Live Sessions Section */}
                {liveSessions && liveSessions.length > 0 && (
                    <View style={styles.liveSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.resultsTitle, { color: COLORS.text.primary }]}>Active Live Classes</Text>
                            <View style={styles.liveBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveScroll}>
                            {liveSessions.map(session => (
                                <TouchableOpacity
                                    key={session.id}
                                    style={[styles.liveCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
                                    onPress={() => {
                                        if (!isAuthenticated) return navigation.navigate('Login');
                                        navigation.navigate('LiveRoom', { roomId: session.roomCode });
                                    }}
                                >
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?q=80&w=600&auto=format&fit=crop' }}
                                        style={styles.liveCardImage}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.liveCardGradient}
                                    >
                                        <View style={styles.liveCardInfo}>
                                            <Text style={styles.liveTitle} numberOfLines={1}>
                                                {session.topic || session.course.title}
                                            </Text>
                                            <Text style={styles.liveTeacher} numberOfLines={1}>
                                                {session.teacher?.fullName || 'Teacher'}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
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
                    {(enrolledCourses || []).slice(0, 4).map((course) => (
                        <Card
                            key={course.id}
                            variant="small"
                            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                            style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border } as ViewStyle}
                        >
                            <Image
                                source={{ uri: course.thumbnail || 'https://images.unsplash.com/photo-1584281723506-6927a4e62211?q=80&w=400&auto=format&fit=crop' }}
                                style={styles.cardThumb}
                            />
                            <Card.Tag textColor={COLORS.primary}>Course</Card.Tag>
                            <Card.Title variant="small" color={COLORS.text.primary}>{course.title}</Card.Title>
                            <Text style={[styles.meta, { color: COLORS.text.secondary }]}>
                                {course.lessonCount} Lessons
                            </Text>
                        </Card>
                    ))}
                </View>

                {(!enrolledCourses || enrolledCourses.length === 0) && !loading && (
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
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: 4,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    brandTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    brandTagText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    bannerContainer: {
        height: 180,
        marginHorizontal: SPACING.xl,
        borderRadius: 24,
        overflow: 'hidden',
        ...SHADOWS.md,
        marginBottom: SPACING.xl,
    },
    bannerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    bannerGradient: {
        ...StyleSheet.absoluteFillObject,
        padding: SPACING.lg,
        justifyContent: 'flex-end',
    },
    bannerContent: {
        gap: 8,
    },
    bannerTextWrapper: {
        flex: 1,
        marginRight: SPACING.md,
    },
    bannerTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    bannerTagText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    bannerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bannerMetaText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
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
    },
    // Live Section Styles
    liveSection: {
        marginBottom: SPACING.xl,
    },
    resultsTitle: {
        ...TYPOGRAPHY.h3,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#FEE2E2',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
        marginRight: 6,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#EF4444',
    },
    liveScroll: {
        paddingVertical: 4,
        gap: SPACING.md,
    },
    liveCard: {
        width: 220,
        height: 140,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        ...SHADOWS.sm,
    },
    liveCardThumbnail: {
        width: '100%',
        height: '100%',
    },
    liveCardImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    liveCardGradient: {
        ...StyleSheet.absoluteFillObject,
        padding: SPACING.md,
        justifyContent: 'flex-end',
    },
    liveCardHeader: {
        alignItems: 'flex-end',
        padding: SPACING.sm,
    },
    liveCardInfo: {
        gap: 2,
    },
    liveTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    liveSubtopic: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    liveTeacher: {
        fontSize: 12,
        marginTop: 2,
    },
    cardThumb: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: SPACING.sm,
    },
});
