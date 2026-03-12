import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, PlayCircle, Star, Clock, FileText } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';

export const CourseDetailScreen = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { theme } = useThemeStore();
    const { isAuthenticated } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const { courseId } = route.params || { courseId: '1' };
    const storeCourse = useCourseStore((state) => state.getCourseById(courseId));

    // Fallback if course not found (e.g. for mock UI testing)
    const course = storeCourse ? {
        ...storeCourse,
        instructor: 'Sheikh Abdullah Al-Mansur',
        category: 'Quranic Sciences',
        description: 'Deepen your connection with the word of Allah through our comprehensive Tajweed and memorization series. This course covers the fundamental rules of articulation and rhythmic recitation.',
        lessons: [
            { id: 'l1', title: 'Introduction to Tajweed Rules', duration: '15 min', completed: true, type: 'video' },
            { id: 'l2', title: 'The Art of Makharij', duration: '25 min', completed: false, type: 'video' },
            { id: 'l3', title: 'Rules of Noon and Meem Sakinah', duration: '20 min', completed: false, type: 'video' },
        ],
    } : {
        id: '1',
        title: 'Mastering Tajweed: Complete Guide',
        instructor: 'Sheikh Abdullah Al-Mansur',
        category: 'Quranic Sciences',
        progress: 35,
        description: 'Deepen your connection with the word of Allah through our comprehensive Tajweed and memorization series. This course covers the fundamental rules of articulation and rhythmic recitation.',
        lessons: [
            { id: 'l1', title: 'Introduction to Tajweed Rules', duration: '15 min', completed: true, type: 'video' },
            { id: 'l2', title: 'The Art of Makharij', duration: '25 min', completed: false, type: 'video' },
            { id: 'l3', title: 'Rules of Noon and Meem Sakinah', duration: '20 min', completed: false, type: 'video' },
        ],
    };

    const getIconForType = (type: string, isLocked: boolean) => {
        if (isLocked) return <PlayCircle size={20} color={COLORS.text.muted} />;
        if (type === 'pdf') return <FileText size={20} color={COLORS.primary} />;
        return <PlayCircle size={20} color={COLORS.primary} />;
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header / Thumbnail Area */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1590076215667-873d3835415f?q=80&w=1200' }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={[styles.heroOverlay, { paddingTop: insets.top + SPACING.md }]}>
                        <TouchableOpacity style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => navigation.goBack()}>
                            <ArrowLeft color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (!isAuthenticated) return navigation.navigate('Login');
                            navigation.navigate('VideoPlayer', { lessonId: course.lessons[0].id, courseId: course.id });
                        }} style={styles.heroPlayIconWrapper}>
                            <PlayCircle size={72} color="#FFFFFF" fill="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Course Info */}
                <View style={[styles.infoSection, { backgroundColor: COLORS.card, borderBottomColor: COLORS.border }]}>
                    <View style={styles.tagRow}>
                        <Text style={[styles.tag, { color: COLORS.primary, backgroundColor: COLORS.secondaryGhost }]}>{course.category}</Text>
                        <View style={styles.ratingBadge}>
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>

                    <Text style={[styles.title, { color: COLORS.text.primary }]}>{course.title}</Text>
                    <Text style={[styles.teacher, { color: COLORS.text.secondary }]}>by {course.instructor}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={16} color={COLORS.text.muted} />
                            <Text style={[styles.metaText, { color: COLORS.text.muted }]}>3h 45m</Text>
                        </View>
                        <View style={[styles.metaDivider, { backgroundColor: COLORS.border }]} />
                        <View style={styles.metaItem}>
                            <FileText size={16} color={COLORS.text.muted} />
                            <Text style={[styles.metaText, { color: COLORS.text.muted }]}>{course.lessons.length} Lessons</Text>
                        </View>
                    </View>

                    <Text style={[styles.description, { color: COLORS.text.secondary }]}>
                        {course.description}
                    </Text>
                </View>

                {/* Course Content */}
                <View style={styles.contentSection}>
                    <Text style={[styles.sectionTitle, { color: COLORS.text.primary }]}>Course Content</Text>

                    <View style={[styles.moduleContainer, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                        {course.lessons.map((lesson, idx) => (
                            <TouchableOpacity
                                key={lesson.id}
                                style={[
                                    styles.lessonRow,
                                    idx !== course.lessons.length - 1 && [styles.lessonRowBorder, { borderBottomColor: COLORS.border }],
                                ]}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (!isAuthenticated) {
                                        navigation.navigate('Login');
                                        return;
                                    }
                                    navigation.navigate('VideoPlayer', { lessonId: lesson.id, courseId: course.id });
                                }}
                            >
                                <View style={[styles.lessonIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.15)' : COLORS.primaryLight }]}>
                                    {lesson.completed ? (
                                        <Star size={20} color={COLORS.secondary} fill={theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : COLORS.secondaryGhost} />
                                    ) : (
                                        getIconForType(lesson.type, false)
                                    )}
                                </View>
                                <View style={styles.lessonInfo}>
                                    <Text style={[styles.lessonTitle, { color: COLORS.text.primary }]}>
                                        {idx + 1}. {lesson.title}
                                    </Text>
                                    <View style={styles.lessonMetaRow}>
                                        <Text style={[styles.lessonDuration, { color: COLORS.text.muted }]}>{lesson.duration}</Text>
                                        {lesson.completed && <Text style={[styles.completedBadge, { color: COLORS.secondary }]}>• Completed</Text>}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, SPACING.md), backgroundColor: COLORS.card, borderTopColor: COLORS.border }]}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.priceLabel, { color: COLORS.text.muted }]}>Subscription Access</Text>
                    <Text style={[styles.price, { color: COLORS.text.primary }]}>Premium Plan</Text>
                </View>
                <Button
                    title="Enroll Now"
                    onPress={() => {
                        if (!isAuthenticated) {
                            navigation.navigate('Login');
                            return;
                        }
                        // Continue enrollment logic...
                    }}
                    style={styles.enrollBtn}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroContainer: {
        width: '100%',
        height: 280,
    },
    heroOverlay: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        justifyContent: 'space-between',
        paddingBottom: SPACING.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroPlayIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -36,
        marginLeft: -36,
    },
    infoSection: {
        padding: SPACING.xl,
        borderBottomWidth: 1,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    tag: {
        fontSize: 13,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    teacher: {
        fontSize: 14,
        marginBottom: SPACING.lg,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
    },
    metaDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: SPACING.md,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    contentSection: {
        padding: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: SPACING.lg,
    },
    moduleContainer: {
        borderRadius: 16,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        borderWidth: 1,
    },
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    lessonRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lessonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    lessonDuration: {
        fontSize: 12,
    },
    lessonMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    completedBadge: {
        fontSize: 11,
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8 },
            android: { elevation: 16 },
        }),
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
    },
    enrollBtn: {
        flex: 1.5,
        marginLeft: SPACING.lg,
    },
});
