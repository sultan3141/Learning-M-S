import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface ProgressBarProps {
    progress: number; // 0 to 100
    height?: number;
    color?: string;
    backgroundColor?: string;
    trackColor?: string; // Alias for backgroundColor
    style?: ViewStyle;
}

export const ProgressBar = ({
    progress,
    height = 8,
    color,
    backgroundColor,
    trackColor,
    style,
}: ProgressBarProps) => {
    // Determine colors with fallbacks (avoiding static COLORS if possible, but keeping defaults)
    const activeColor = color || COLORS.primary;
    const inactiveColor = trackColor || backgroundColor || COLORS.progressBg;

    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={[styles.background, { height, backgroundColor: inactiveColor }, style]}>
            <View
                style={[
                    styles.fill,
                    { width: `${clampedProgress}%`, backgroundColor: activeColor },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        width: '100%',
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: SPACING.md,
    },
    fill: {
        height: '100%',
        borderRadius: 100,
    },
});
