import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    isPassword?: boolean;
    leftIcon?: React.ReactNode;
}

export const Input = ({ label, error, style, isPassword, leftIcon, ...props }: InputProps) => {
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: COLORS.text.primary }]}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    { backgroundColor: COLORS.card, borderColor: COLORS.border },
                    isFocused && [styles.inputFocused, { borderColor: COLORS.primary, backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF' }],
                    error && styles.inputError,
                    style,
                ]}
            >
                {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
                <TextInput
                    style={[styles.input, { color: COLORS.text.primary }]}
                    placeholderTextColor={COLORS.text.muted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={COLORS.text.muted} />
                        ) : (
                            <Eye size={20} color={COLORS.text.muted} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: SPACING.lg,
        height: 52,
    },
    inputFocused: {
        // Dynamic colors handled in inline styles
    },
    inputError: {
        borderColor: '#EF4444', // Hardcoded danger color for consistency
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
    },
    eyeIcon: {
        marginLeft: SPACING.sm,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    sendBtn: { padding: SPACING.md, marginLeft: SPACING.sm },
    leftIconContainer: {
        marginRight: SPACING.sm,
    },
});
