import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LucideIcons from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS_LIGHT, COLORS_DARK } from '../../constants/theme';

interface IslamicThumbnailProps {
    icon?: keyof typeof LucideIcons;
    title?: string;
    style?: ViewStyle;
}

export const IslamicThumbnail = ({ icon = 'BookOpen', title, style }: IslamicThumbnailProps) => {
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    // Select Icon component
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.BookOpen;

    // Pattern dots for a "geometric" sense
    const renderPattern = () => {
        const dots = [];
        for (let i = 0; i < 20; i++) {
            dots.push(
                <View
                    key={i}
                    style={[
                        styles.dot,
                        {
                            top: `${Math.random() * 100}%` as any,
                            left: `${Math.random() * 100}%` as any,
                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                        }
                    ]}
                />
            );
        }
        return dots;
    };

    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={theme === 'dark' ? ['#312E81', '#1E1B4B'] : ['#EEF2FF', '#E0E7FF']}
                style={styles.gradient}
            >
                {renderPattern()}
                <View style={styles.iconContainer}>
                    <IconComponent size={40} color={COLORS.primary} strokeWidth={1.5} />
                </View>
                {title && (
                    <Text style={[styles.title, { color: COLORS.text.primary }]} numberOfLines={1}>
                        {title}
                    </Text>
                )}
                {/* Symbolic crescent/star corner decoration */}
                <View style={styles.decoration}>
                    <LucideIcons.Moon size={60} color={COLORS.primary} style={styles.decorationIcon} />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        zIndex: 10,
    },
    dot: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    decoration: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        opacity: 0.1,
    },
    decorationIcon: {
        transform: [{ rotate: '-15deg' }],
    }
});
