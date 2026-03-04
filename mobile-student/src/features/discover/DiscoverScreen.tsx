import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, PlayCircle } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';
const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Marketing'];

export const DiscoverScreen = () => {
    const navigation = useNavigation<any>();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const { theme } = useThemeStore();
    const { token, isAuthenticated } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    useEffect(() => {
        if (isAuthenticated) {
            fetchLiveSessions();
        }
    }, [isAuthenticated]);

    const fetchLiveSessions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/live-sessions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLiveSessions(response.data);
        } catch (err) {
            console.error('Failed to fetch live sessions:', err);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>Discover</Text>
                <Text style={[styles.headerSubtitle, { color: COLORS.text.secondary }]}>Find your next course</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search color={COLORS.text.muted} size={20} style={styles.searchIcon} />
                    <Input
                        label=""
                        placeholder="Search courses, mentors..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInputWrapper}
                        returnKeyType="search"
                    />
                </View>
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {CATEGORIES.map((category) => {
                        const isActive = activeCategory === category;
                        return (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: isActive ? COLORS.primary : COLORS.card,
                                        borderColor: isActive ? COLORS.primary : COLORS.border
                                    }
                                ]}
                                onPress={() => setActiveCategory(category)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        { color: isActive ? COLORS.text.inverse : COLORS.text.secondary }
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Live Sessions Section */}
                {liveSessions.length > 0 && (
                    <View style={styles.liveSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.resultsTitle, { color: COLORS.text.primary }]}>Live Classes</Text>
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
                                    onPress={() => navigation.navigate('LiveRoom', { roomId: session.roomCode })}
                                >
                                    <View style={styles.liveCardHeader}>
                                        <PlayCircle color={COLORS.primary} size={24} />
                                        <Text style={[styles.roomCode, { color: COLORS.text.muted }]}>#{session.roomCode}</Text>
                                    </View>
                                    <View style={styles.liveCardInfo}>
                                        <Text style={[styles.liveTitle, { color: COLORS.text.primary }]} numberOfLines={1}>{session.course.title}</Text>
                                        <Text style={[styles.liveTeacher, { color: COLORS.text.secondary }]}>{session.teacher?.fullName || 'Teacher'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <Text style={[styles.resultsTitle, { color: COLORS.text.primary }]}>Featured Courses</Text>

                {/* Dummy Data for UI layout purposes */}
                <Card variant="list" style={{ ...styles.courseCard, backgroundColor: COLORS.card, borderColor: COLORS.border } as ViewStyle} onPress={() => (navigation as any).navigate('CourseDetail', { courseId: '1' })}>
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme === 'dark' ? COLORS.primaryLight : COLORS.primary }]}>
                        <Text style={[styles.thumbnailText, { color: theme === 'dark' ? COLORS.primary : '#FFFFFF' }]}>RN</Text>
                    </View>
                    <View style={styles.courseInfo}>
                        <Text style={[styles.courseTitle, { color: COLORS.text.primary }]} numberOfLines={2}>Advanced React Native Animations</Text>
                        <Text style={[styles.courseTeacher, { color: COLORS.text.secondary }]}>by Sarah Jenkins</Text>
                        <View style={styles.courseMetaSection}>
                            <Text style={[styles.courseMeta, { color: COLORS.text.muted }]}>4.8 ★  •  24 Lessons</Text>
                            <Text style={[styles.coursePrice, { color: COLORS.primary }]}>$49</Text>
                        </View>
                    </View>
                </Card>

                <Card variant="list" style={{ ...styles.courseCard, backgroundColor: COLORS.card, borderColor: COLORS.border } as ViewStyle} onPress={() => (navigation as any).navigate('CourseDetail', { courseId: '1' })}>
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme === 'dark' ? COLORS.primaryLight : COLORS.primary }]}>
                        <Text style={[styles.thumbnailText, { color: theme === 'dark' ? COLORS.primary : '#FFFFFF' }]}>TS</Text>
                    </View>
                    <View style={styles.courseInfo}>
                        <Text style={[styles.courseTitle, { color: COLORS.text.primary }]} numberOfLines={2}>Mastering TypeScript 5.0</Text>
                        <Text style={[styles.courseTeacher, { color: COLORS.text.secondary }]}>by John Doe</Text>
                        <View style={styles.courseMetaSection}>
                            <Text style={[styles.courseMeta, { color: COLORS.text.muted }]}>4.9 ★  •  18 Lessons</Text>
                            <Text style={[styles.coursePrice, { color: COLORS.primary }]}>$39</Text>
                        </View>
                    </View>
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
};

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
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    searchBar: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: SPACING.lg,
        top: 15,
        zIndex: 1,
    },
    searchInputWrapper: {
        paddingLeft: 40,
        height: 50,
    },
    categoriesContainer: {
        marginBottom: SPACING.lg,
    },
    categoriesScroll: {
        paddingHorizontal: SPACING.xl,
        gap: SPACING.sm,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    content: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 120, // Tab bar padding
        gap: SPACING.md,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    courseCard: {
        alignItems: 'flex-start',
        gap: SPACING.md,
    },
    thumbnailPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnailText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 20,
    },
    courseInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    courseTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    courseTeacher: {
        fontSize: 13,
        marginBottom: SPACING.md,
    },
    courseMetaSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseMeta: {
        fontSize: 12,
    },
    coursePrice: {
        fontSize: 15,
        fontWeight: '700',
    },
    // Live Section Styles
    liveSection: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
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
        width: 180,
        padding: SPACING.md,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: SPACING.md,
    },
    liveCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    roomCode: {
        fontSize: 12,
        fontWeight: '600',
    },
    liveCardInfo: {
        marginTop: 4,
    },
    liveTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    liveTeacher: {
        fontSize: 12,
        marginTop: 2,
    },
});
