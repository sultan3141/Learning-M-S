import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

const API_BASE_URL = 'http://localhost:4000';

export const LoginScreen = () => {
    const navigation = useNavigation();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const { login } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;

        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const { accessToken, user } = res.data;

            login(accessToken, user);

            if (user.mustChangePassword) {
                (navigation as any).navigate('ChangePassword');
            } else {
                (navigation as any).navigate('MainTabs');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Login failed');
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
                        <View style={[styles.logoContainer, { backgroundColor: COLORS.primary }]}>
                            <Text style={[styles.logoText, { color: COLORS.text.inverse }]}>EduApp</Text>
                        </View>
                        <Text style={[styles.title, { color: COLORS.text.primary }]}>Welcome back</Text>
                        <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>Sign in to continue your learning journey.</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                            <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isLoading}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: COLORS.text.secondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => (navigation as any).navigate('Register')}>
                            <Text style={[styles.footerAction, { color: COLORS.primary }]}>Sign Up</Text>
                        </TouchableOpacity>
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
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    logoText: {
        fontWeight: '800',
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.xl,
        marginTop: -SPACING.sm,
    },
    forgotPasswordText: {
        fontSize: 13,
        fontWeight: '600',
    },
    loginButton: {
        height: 56,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: SPACING.xxl,
    },
    footerText: {
        fontSize: 14,
    },
    footerAction: {
        fontSize: 14,
        fontWeight: '600',
    },
});
