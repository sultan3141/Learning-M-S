import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    variant?: 'large' | 'small' | 'list';
}

export const Card = ({ children, onPress, style, variant = 'large' }: CardProps) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'large': return styles.large;
            case 'small': return styles.small;
            case 'list': return styles.list;
            default: return styles.large;
        }
    };

    const CardContent = (
        <View style={[styles.base, getVariantStyles(), style]}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: COLORS.card,
    },
    large: {
        borderRadius: 24,
        padding: SPACING.lg,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    small: {
        flex: 1,
        borderRadius: 20,
        padding: SPACING.md,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    tag: {
        ...TYPOGRAPHY.tag,
        color: COLORS.primary,
        marginBottom: SPACING.tiny,
    },
    titleLarge: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text.primary,
        marginBottom: SPACING.tiny,
    },
    titleSmall: {
        ...TYPOGRAPHY.body2,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    subtitle: {
        ...TYPOGRAPHY.body2,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
    },
});

// Helper sub-components
Card.Tag = ({ children, style, textColor }: { children: React.ReactNode; style?: ViewStyle; textColor?: string }) => (
    <Text style={[styles.tag, textColor ? { color: textColor } : null, style]}>{children}</Text>
);

Card.Title = ({ children, variant = 'large', style, color }: { children: React.ReactNode; variant?: 'large' | 'small', style?: ViewStyle; color?: string }) => (
    <Text style={[variant === 'large' ? styles.titleLarge : styles.titleSmall, color ? { color } : null, style]}>{children}</Text>
);

Card.Subtitle = ({ children, style, color }: { children: React.ReactNode; style?: ViewStyle; color?: string }) => (
    <Text style={[styles.subtitle, color ? { color } : null, style]}>{children}</Text>
);

