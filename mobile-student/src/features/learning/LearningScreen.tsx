import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, Dimensions, FlatList, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Book, BookOpen, Bookmark, ChevronRight, Library, Star, MoonStar, PenTool, Scale, History as HistoryIcon, MessageSquare } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
    { id: '1', title: 'Quran', icon: 'BookOpen' },
    { id: '2', title: 'Hadith', icon: 'MessageSquare' },
    { id: '3', title: 'Tafsir', icon: 'Book' },
    { id: '4', title: 'Fiqh', icon: 'Scale' },
    { id: '5', title: 'History', icon: 'History' },
];

const BOOKS = [
    {
        id: 'q1',
        title: 'The Noble Quran',
        author: 'Allah (SWT)',
        category: 'Quran',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop',
        isFeatured: true
    },
    {
        id: 'h1',
        title: 'Sahih Al-Bukhari',
        author: 'Imam Bukhari',
        category: 'Hadith',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1591104711683-021abc3c1d3b?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'h2',
        title: 'Riyadus Saliheen',
        author: 'Imam An-Nawawi',
        category: 'Hadith',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1584281723506-6927a4e62211?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 't1',
        title: 'Tafsir Ibn Kathir',
        author: 'Ibn Kathir',
        category: 'Tafsir',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1590076215667-873d3835415f?q=80&w=400&auto=format&fit=crop'
    }
];

export const LearningScreen = () => {
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const [searchQuery, setSearchQuery] = useState('');

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>Study Library</Text>
                <Text style={[styles.headerSubtitle, { color: COLORS.text.secondary }]}>Enhance your knowledge</Text>
            </View>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: COLORS.surface }]}>
                <Bookmark color={COLORS.primary} size={22} />
            </TouchableOpacity>
        </View>
    );

    const renderSearchBar = () => (
        <View style={[styles.searchContainer, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Search color={COLORS.text.muted} size={20} />
            <TextInput
                placeholder="Search books, authors..."
                placeholderTextColor={COLORS.text.muted}
                style={[styles.searchInput, { color: COLORS.text.primary }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );

    const renderFeaturedBook = () => {
        const featured = BOOKS.find(b => b.isFeatured);
        if (!featured) return null;

        return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: COLORS.text.primary }]}>Featured Book</Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.featuredCard, { backgroundColor: COLORS.primary }]}
                >
                    <Image source={{ uri: featured.image }} style={styles.featuredImage} />
                    <View style={styles.featuredContent}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Essential</Text>
                        </View>
                        <Text style={styles.featuredTitle}>{featured.title}</Text>
                        <Text style={styles.featuredAuthor}>By {featured.author}</Text>
                        <View style={styles.ratingRow}>
                            <Star color="#FFD700" size={16} fill="#FFD700" />
                            <Text style={styles.ratingText}>{featured.rating}</Text>
                        </View>
                        <TouchableOpacity style={styles.readButton}>
                            <Text style={styles.readButtonText}>Read Now</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderCategories = () => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.text.primary }]}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                        <View style={[styles.categoryIcon, { backgroundColor: COLORS.primaryLight }]}>
                            <Book color={COLORS.primary} size={20} />
                        </View>
                        <Text style={[styles.categoryTitle, { color: COLORS.text.primary }]}>{cat.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderHeader()}
                {renderSearchBar()}
                {renderCategories()}
                {renderFeaturedBook()}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: COLORS.text.primary }]}>Recommended for You</Text>
                        <TouchableOpacity>
                            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.booksGrid}>
                        {BOOKS.filter(b => !b.isFeatured).map(book => (
                            <TouchableOpacity key={book.id} style={styles.bookItem}>
                                <Image source={{ uri: book.image }} style={styles.bookCover} />
                                <Text style={[styles.bookTitle, { color: COLORS.text.primary }]} numberOfLines={2}>{book.title}</Text>
                                <Text style={[styles.bookAuthor, { color: COLORS.text.secondary }]}>{book.author}</Text>
                            </TouchableOpacity>
                        ))}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.lg,
    },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    headerSubtitle: { fontSize: 14, marginTop: 2 },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        paddingHorizontal: SPACING.md,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: SPACING.xl,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: 15,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    categoriesList: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    categoryCard: {
        alignItems: 'center',
        width: 80,
        padding: SPACING.sm,
        borderRadius: 16,
        borderWidth: 1,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryTitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    featuredCard: {
        marginHorizontal: SPACING.lg,
        borderRadius: 24,
        flexDirection: 'row',
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.md,
    },
    featuredImage: {
        width: SCREEN_WIDTH * 0.28,
        height: SCREEN_WIDTH * 0.4,
        borderRadius: 16,
        overflow: 'hidden',
    },
    featuredContent: {
        flex: 1,
        marginLeft: SPACING.lg,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    featuredTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    featuredAuthor: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    ratingText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    readButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    readButtonText: {
        color: '#4F46E5',
        fontWeight: '700',
        fontSize: 14,
    },
    booksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        justifyContent: 'space-between',
    },
    bookItem: {
        width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2,
        marginBottom: SPACING.lg,
    },
    bookCover: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 8,
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    bookAuthor: {
        fontSize: 12,
    }
});
