import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../config/api';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const { token, logout } = useAuthStore();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            return Alert.alert('Error', 'Password must be at least 6 characters long');
        }
        if (newPassword !== confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match');
        }

        setIsLoading(true);
        try {
            await api.patch('/auth/change-password', { newPassword });

            Alert.alert(
                'Success',
                'Password updated successfully! Please log in again with your new password.',
                [{ text: 'OK', onPress: () => logout() }]
            );
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: COLORS.text.primary }]}>Update Password</Text>
                        <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>
                            This is your first time logging in. Please set a new password for your account.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            isPassword
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            isPassword
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <Button
                            title="Update Password"
                            onPress={handleChangePassword}
                            loading={isLoading}
                            style={styles.button}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SPACING.xxl,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    button: {
        height: 56,
        marginTop: SPACING.lg,
    },
});
