import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { api } from '../../config/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const { login } = useAuthStore();

    const requireTeacher = route.params?.requireTeacher;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;

        const sanitizedEmail = email.trim().toLowerCase();

        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email: sanitizedEmail, password });
            const { accessToken, user: backendUser } = res.data;

            if (requireTeacher && backendUser.role !== 'TEACHER') {
                alert('Access denied. Please log in with a Teacher account to create live rooms.');
                return;
            }

            const user = {
                id: backendUser.id,
                role: backendUser.role,
                fullName: backendUser.fullName || sanitizedEmail.split('@')[0],
                email: sanitizedEmail,
            };

            login(accessToken, user);

            if (requireTeacher) {
                (navigation as any).replace('CreateRoom');
            } else {
                (navigation as any).navigate('MainTabs');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            alert(errorMessage);
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
                        <Text style={[styles.title, { color: COLORS.text.primary }]}>
                            {requireTeacher ? 'Teacher Login' : 'Welcome back'}
                        </Text>
                        <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>
                            {requireTeacher ? 'Sign in as a teacher to create and manage live rooms.' : 'Sign in to continue your learning journey.'}
                        </Text>
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
});
