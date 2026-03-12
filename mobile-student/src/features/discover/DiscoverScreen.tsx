import React, { useState, useEffect } from 'react';
import {
    ScrollView, StyleSheet, View, Text, TouchableOpacity,
    Image, Dimensions, FlatList, TextInput, ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Play, Heart, Share2, Clock, Eye, MoonStar, BookOpen, GraduationCap, Users, TrendingUp, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS_LIGHT, COLORS_DARK, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOP_CATEGORIES = ['All', 'Quran', 'Hadith', 'Seerah', 'Fiqh', 'History', 'Family'];

const FEATURED_VIDEO = {
    id: 'f1',
    title: 'Modern Tajweed: Mastery Series',
    author: 'Sheikh Ahmed Al-Azhar',
    duration: '1h 24m',
    views: '12K',
    thumbnail: 'https://images.unsplash.com/photo-1609510107053-fd303494ee60?q=80&w=800&auto=format&fit=crop',
    category: 'Quran'
};

const DISCOVER_VIDEOS = [
    {
        id: 'v1',
        title: 'The Prophetic Character in Daily Life',
        author: 'Dr. Hussain Ali',
        duration: '45:30',
        views: '8.4K',
        thumbnail: 'https://images.unsplash.com/photo-1542810634-7bc2043d308b?q=80&w=600&auto=format&fit=crop',
        category: 'Seerah'
    },
    {
        id: 'v2',
        title: 'Fiqh of Prayer: Concise Guide',
        author: 'Imam Yasin',
        duration: '1:12:00',
        views: '15K',
        thumbnail: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?q=80&w=600&auto=format&fit=crop',
        category: 'Fiqh'
    },
    {
        id: 'v3',
        title: 'Stories of the Companions',
        author: 'Sheikh Omar',
        duration: '38:15',
        views: '22K',
        thumbnail: 'https://images.unsplash.com/photo-1563229281-22878ce458a6?q=80&w=600&auto=format&fit=crop',
        category: 'History'
    },
    {
        id: 'v4',
        title: 'Parenting in the Islamic Way',
        author: 'Ustadha Maryam',
        duration: '52:10',
        views: '5.6K',
        thumbnail: 'https://images.unsplash.com/photo-1491438590914-bc09fca97c21?q=80&w=600&auto=format&fit=crop',
        category: 'Family'
    }
];

export const DiscoverScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>Explore Wisdom</Text>
            <View style={styles.headerRow}>
                <View style={[styles.searchBar, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                    <Search color={COLORS.text.muted} size={18} />
                    <TextInput
                        placeholder="Search videos, series..."
                        placeholderTextColor={COLORS.text.muted}
                        style={[styles.searchInput, { color: COLORS.text.primary }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                    <Filter color={COLORS.primary} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFeatured = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <TrendingUp color={COLORS.primary} size={20} />
                <Text style={[styles.sectionTitle, { color: COLORS.text.primary }]}>Live Spotlight</Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.featuredCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
                onPress={() => navigation.navigate('LiveJoin')}
            >
                <Image source={{ uri: FEATURED_VIDEO.thumbnail }} style={styles.featuredThumbnail} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.featuredGradient}
                >
                    <View style={styles.featuredContent}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Live Premiere</Text>
                        </View>
                        <Text style={styles.featuredTitle}>{FEATURED_VIDEO.title}</Text>
                        <View style={styles.featuredMeta}>
                            <Clock color="white" size={14} />
                            <Text style={styles.featuredMetaText}>{FEATURED_VIDEO.duration}</Text>
                            <Eye color="white" size={14} style={{ marginLeft: 10 }} />
                            <Text style={styles.featuredMetaText}>{FEATURED_VIDEO.views}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderCategories = () => (
        <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                {TOP_CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat;
                    return (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: isActive ? COLORS.primary : COLORS.card,
                                    borderColor: isActive ? COLORS.primary : COLORS.border
                                }
                            ]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.pillText, { color: isActive ? 'white' : COLORS.text.secondary }]}>{cat}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    const renderVideoCard = (video: any) => (
        <TouchableOpacity
            key={video.id}
            activeOpacity={0.7}
            style={[styles.videoCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
        >
            <View style={styles.thumbnailContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                </View>
            </View>
            <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: COLORS.text.primary }]} numberOfLines={2}>{video.title}</Text>
                <Text style={[styles.videoAuthor, { color: COLORS.text.secondary }]}>{video.author}</Text>
                <View style={styles.videoStats}>
                    <Text style={[styles.videoMeta, { color: COLORS.text.muted }]}>{video.views} views</Text>
                    <View style={styles.dot} />
                    <Text style={[styles.videoMeta, { color: COLORS.primary }]}>{video.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderHeader()}
                {renderCategories()}
                {renderFeatured()}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitleMain, { color: COLORS.text.primary }]}>Recommended Lessons</Text>
                    <View style={styles.videoGrid}>
                        {DISCOVER_VIDEOS.map(v => renderVideoCard(v))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: SPACING.lg,
    },
    headerRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },
    filterBtn: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        marginBottom: SPACING.xl,
    },
    categoriesScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    sectionTitleMain: {
        fontSize: 20,
        fontWeight: '800',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    featuredCard: {
        marginHorizontal: SPACING.lg,
        borderRadius: 20,
        overflow: 'hidden',
        ...SHADOWS.md,
        height: 200,
    },
    featuredThumbnail: {
        width: '100%',
        height: '100%',
    },
    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
        padding: SPACING.lg,
        justifyContent: 'flex-end',
    },
    featuredContent: {
        gap: 8,
    },
    badge: {
        backgroundColor: 'rgba(79, 70, 229, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featuredMetaText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    featuredInfo: {
        padding: SPACING.lg,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E515',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4F46E5',
        marginRight: 6,
    },
    liveLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4F46E5',
    },
    videoTitleLarge: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    videoAuthor: {
        fontSize: 14,
    },
    videoGrid: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.lg,
    },
    videoCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 10,
        gap: 12,
    },
    thumbnailContainer: {
        width: 120,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    videoInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    videoTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    videoAuthorSmall: {
        fontSize: 12,
        marginBottom: 4,
    },
    videoStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#94A3B8',
    }
});
