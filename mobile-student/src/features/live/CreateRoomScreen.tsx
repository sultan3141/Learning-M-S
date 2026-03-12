import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, Lock, User as UserIcon } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../config/api';

export const CreateRoomScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useThemeStore();
    const { login, user, token } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [topic, setTopic] = useState('');
    const [subtopic, setSubtopic] = useState('');

    // Check if current user is a teacher
    const isTeacher = user?.role === 'TEACHER';
    const hasTeacherAccess = isTeacher && token;

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter email and password');
            return;
        }

        setIsAuthenticating(true);
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const { accessToken, user: backendUser } = response.data;

            // Check if user is a teacher
            if (backendUser.role !== 'TEACHER') {
                Alert.alert('Access Denied', 'Only teachers can create live rooms.');
                return;
            }

            // Store teacher token in store so interceptor picks it up
            login(accessToken, {
                id: backendUser.id,
                role: backendUser.role,
                fullName: backendUser.fullName || email.split('@')[0],
                email: email,
            });

            Alert.alert('Success', 'Logged in as teacher!');
        } catch (err: any) {
            console.error('Login error:', err);
            Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleCreate = async () => {
        if (!topic.trim()) {
            Alert.alert('Missing Topic', 'Please enter a topic for your live class');
            return;
        }

        setIsCreating(true);
        try {
            const response = await api.post(
                '/live-sessions',
                {
                    topic,
                    subtopic
                }
            );

            // Navigate directly to the live room
            navigation.navigate('LiveRoom', { roomId: response.data.roomCode });
        } catch (err: any) {
            console.error('Create room error:', err);
            Alert.alert('Creation Failed', err.response?.data?.message || 'Failed to create room');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text.primary} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>Create Live Room</Text>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {!hasTeacherAccess ? (
                        <View style={styles.section}>
                            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondaryGhost }]}>
                                <Lock size={40} color={COLORS.primary} />
                            </View>
                            <Text style={[styles.title, { color: COLORS.text.primary }]}>Teacher Access</Text>
                            <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>
                                Sign in with your teacher account to create live sessions.
                            </Text>

                            <Input
                                label="Email"
                                placeholder="teacher@test.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                leftIcon={<UserIcon size={20} color={COLORS.text.muted} />}
                            />
                            <Input
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                leftIcon={<Lock size={20} color={COLORS.text.muted} />}
                            />

                            <Button
                                title="Login as Teacher"
                                onPress={handleAuth}
                                loading={isAuthenticating}
                                style={styles.actionButton}
                            />

                            <Text style={[styles.hint, { color: COLORS.text.muted }]}>
                                Only registered teacher accounts can create rooms.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                                <Plus size={40} color={'#22C55E'} />
                            </View>
                            <Text style={[styles.title, { color: COLORS.text.primary }]}>Start Live Class</Text>
                            <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>
                                Enter the topic and subtopic to start your live session for students.
                            </Text>

                            <Input
                                label="Topic"
                                placeholder="e.g. Introduction to Physics"
                                value={topic}
                                onChangeText={setTopic}
                                style={{ marginTop: SPACING.md }}
                            />

                            <Input
                                label="Subtopic"
                                placeholder="e.g. Newton's Laws"
                                value={subtopic}
                                onChangeText={setSubtopic}
                                style={{ marginTop: SPACING.xs }}
                            />

                            <Button
                                title="Create Live Room"
                                onPress={handleCreate}
                                loading={isCreating}
                                style={[styles.actionButton, { backgroundColor: COLORS.primary }] as any}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    keyboardView: { flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
    section: { marginTop: 20 },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.xl
    },
    title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.sm },
    subtitle: { fontSize: 15, textAlign: 'center', marginBottom: SPACING.xxl, paddingHorizontal: SPACING.lg, lineHeight: 22 },
    actionButton: { marginTop: SPACING.xl, height: 56 },
    hint: { fontSize: 13, textAlign: 'center', marginTop: SPACING.md, fontStyle: 'italic' }
});
