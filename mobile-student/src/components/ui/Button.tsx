import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Animated } from 'react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}: ButtonProps) => {
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const getContainerStyle = () => {
        switch (variant) {
            case 'primary': return { backgroundColor: COLORS.primary };
            case 'secondary': return { backgroundColor: COLORS.secondary };
            case 'ghost': return { backgroundColor: COLORS.primaryLight };
            case 'outline': return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary };
            default: return { backgroundColor: COLORS.primary };
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary': return { color: COLORS.text.inverse };
            case 'secondary': return { color: COLORS.text.inverse };
            case 'ghost': return { color: COLORS.primary };
            case 'outline': return { color: COLORS.primary };
            default: return { color: COLORS.text.inverse };
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                style={[
                    styles.container,
                    getContainerStyle() as ViewStyle,
                    disabled && styles.disabled,
                    style,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
            >
                {loading ? (
                    <ActivityIndicator color={variant === 'ghost' || variant === 'outline' ? COLORS.primary : COLORS.text.inverse} />
                ) : (
                    <>
                        {icon}
                        <Text style={[styles.text, getTextStyle() as TextStyle, textStyle]}>{title}</Text>
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: SPACING.lg,
        borderRadius: 14,
        gap: SPACING.sm,
        ...SHADOWS.sm,
    },
    text: {
        ...TYPOGRAPHY.body2,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
