import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';

export const RegisterScreen = () => {
    const navigation = useNavigation();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            (navigation as any).navigate('MainTabs');
        }, 1500);
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
                        <Text style={[styles.title, { color: COLORS.text.primary }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>Join thousands of students learning every day.</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            autoCapitalize="words"
                            value={name}
                            onChangeText={setName}
                        />

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
                            placeholder="Create a password"
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                        />

                        <View style={styles.termsContainer}>
                            <Text style={[styles.termsText, { color: COLORS.text.secondary }]}>
                                By signing up, you agree to our{' '}
                                <Text style={[styles.termsLink, { color: COLORS.primary }]}>Terms of Service</Text> and{' '}
                                <Text style={[styles.termsLink, { color: COLORS.primary }]}>Privacy Policy</Text>.
                            </Text>
                        </View>

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isLoading}
                            style={styles.registerButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: COLORS.text.secondary }]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.footerAction, { color: COLORS.primary }]}>Sign In</Text>
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
        marginTop: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 15,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    termsContainer: {
        marginBottom: SPACING.xl,
        marginTop: SPACING.sm,
    },
    termsText: {
        fontSize: 13,
        lineHeight: 18,
    },
    termsLink: {
        fontWeight: '600',
    },
    registerButton: {
        height: 56,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.lg,
    },
    footerText: {
        fontSize: 14,
    },
    footerAction: {
        fontSize: 14,
        fontWeight: '600',
    },
});
