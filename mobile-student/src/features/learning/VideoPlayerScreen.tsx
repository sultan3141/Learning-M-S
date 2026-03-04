import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Maximize, Minimize, ArrowLeft, SkipBack, SkipForward } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useThemeStore } from '../../store/useThemeStore';

const { width } = Dimensions.get('window');

import { useCourseStore } from '../../store/useCourseStore';
import { Button } from '../../components/ui/Button';

export const VideoPlayerScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const { lessonId, courseId } = (route.params as any) || { lessonId: 'l4', courseId: '1' };

    const markLessonComplete = useCourseStore((state) => state.markLessonComplete);
    const course = useCourseStore((state) => state.getCourseById(courseId));
    const lesson = course?.lessons.find(l => l.id === lessonId);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
    const handleClose = () => navigation.goBack();

    // Toggle controls visibility when tapping video area
    const handleVideoTap = () => setShowControls(!showControls);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top', 'bottom']}>
            <View style={isFullscreen ? styles.videoWrapperFullscreen : styles.videoWrapperDefault}>
                {/* Mock Video Surface */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.videoSurface}
                    onPress={handleVideoTap}
                >
                    <Text style={[styles.videoMockText, { color: '#FFFFFF' }]}>Video Render Area</Text>
                    <Text style={[styles.videoMockSubtext, { color: 'rgba(255,255,255,0.6)' }]}>Lesson ID: {lessonId}</Text>
                </TouchableOpacity>

                {/* Overlay Controls */}
                {showControls && (
                    <View style={styles.controlsOverlay} pointerEvents="box-none">

                        {/* Top Bar */}
                        <View style={styles.topBar}>
                            <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                                <ArrowLeft color="#FFFFFF" size={24} />
                            </TouchableOpacity>
                            <Text style={[styles.videoTitle, { color: '#FFFFFF' }]}>{lesson?.title || 'Video Lesson'}</Text>
                            <View style={{ width: 24 }} /> {/* Balance space */}
                        </View>

                        {/* Center Controls */}
                        <View style={styles.centerControls} pointerEvents="box-none">
                            <TouchableOpacity style={styles.centerBtn}>
                                <SkipBack color="#FFFFFF" size={32} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.centerBtn, styles.playBtn]} onPress={togglePlay}>
                                {isPlaying ? (
                                    <Pause color="#FFFFFF" size={40} />
                                ) : (
                                    <Play color="#FFFFFF" size={40} style={{ marginLeft: 4 }} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.centerBtn}>
                                <SkipForward color="#FFFFFF" size={32} />
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Bar */}
                        <View style={styles.bottomBar}>
                            <View style={styles.timeContainer}>
                                <Text style={[styles.timeText, { color: '#FFFFFF' }]}>12:05</Text>
                                <Text style={styles.timeTextMuted}> / 24:00</Text>
                            </View>

                            <View style={styles.progressWrapper}>
                                <ProgressBar progress={50} height={4} color={COLORS.primary} trackColor="rgba(255,255,255,0.3)" />
                            </View>

                            <TouchableOpacity onPress={toggleFullscreen} style={styles.iconBtn}>
                                {isFullscreen ? (
                                    <Minimize color="#FFFFFF" size={24} />
                                ) : (
                                    <Maximize color="#FFFFFF" size={24} />
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
            </View>

            {/* If not fullscreen, show some content below */}
            {!isFullscreen && (
                <View style={[styles.detailsSection, { backgroundColor: COLORS.card, flex: 1 }]}>
                    <Text style={[styles.lessonTitle, { color: COLORS.text.primary }]}>{lesson?.title || 'Lesson'}</Text>
                    <Text style={[styles.lessonDesc, { color: COLORS.text.secondary }]}>
                        In this lesson, we cover the basics of React Native layouts, explaining how Flexbox maps to iOS and Android under the hood.
                    </Text>

                    {!lesson?.completed && (
                        <Button
                            title="Complete Lesson"
                            style={{ marginTop: SPACING.xl }}
                            onPress={() => {
                                markLessonComplete(courseId, lessonId);
                                navigation.goBack();
                            }}
                        />
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoWrapperDefault: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoWrapperFullscreen: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoSurface: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
    },
    videoMockText: {
        fontSize: 20,
        fontWeight: '700',
    },
    videoMockSubtext: {
        marginTop: 8,
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    iconBtn: {
        padding: SPACING.sm,
    },
    centerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xl,
    },
    centerBtn: {
        padding: SPACING.md,
    },
    playBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
        gap: SPACING.sm,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    timeTextMuted: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    progressWrapper: {
        flex: 1,
        paddingHorizontal: SPACING.sm,
    },
    detailsSection: {
        padding: SPACING.xl,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    lessonDesc: {
        fontSize: 15,
        lineHeight: 22,
    },
});
