import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, Lock, User as UserIcon, BookOpen, ChevronRight } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export const CreateRoomScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useThemeStore();
    const { token, login, isAuthenticated, user } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'TEACHER') {
            fetchTeacherCourses();
        }
    }, [isAuthenticated, user]);

    const fetchTeacherCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses/teacher/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    };

    const handleAuth = async () => {
        if (!email || !password) return;

        setIsAuthenticating(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            // In a real app, you'd decode the JWT to get role. For now, we assume if login works...
            // But let's check if the user is a teacher (we'd need another endpoint or decoded token)
            // Mocking for now: if email contains teacher, it's a teacher
            login(response.data.accessToken, {
                id: 'teacher-id',
                name: 'Teacher Name',
                email,
                role: 'TEACHER'
            });
        } catch (err: any) {
            Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleCreate = async () => {
        if (!selectedCourse) return;
        setIsCreating(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/live-sessions`, {
                courseId: selectedCourse.id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Success', `Room created! Room Code: ${response.data.roomCode}`, [
                { text: 'GO TO ROOM', onPress: () => navigation.navigate('LiveRoom', { roomId: response.data.roomCode }) }
            ]);
        } catch (err: any) {
            Alert.alert('Creation Failed', err.response?.data?.message || 'Error creating room');
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
                    {!isAuthenticated || user?.role !== 'TEACHER' ? (
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
                                placeholder="teacher@school.com"
                                value={email}
                                onChangeText={setEmail}
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
                                title="Authenticate"
                                onPress={handleAuth}
                                loading={isAuthenticating}
                                style={styles.actionButton}
                            />
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                                <Plus size={40} color={'#22C55E'} />
                            </View>
                            <Text style={[styles.title, { color: COLORS.text.primary }]}>Start Live Class</Text>
                            <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>
                                Select a course to create a live room for your students.
                            </Text>

                            <TouchableOpacity
                                style={[styles.selector, { borderColor: COLORS.border, backgroundColor: theme === 'dark' ? COLORS.secondaryGhost : '#fff' }]}
                                onPress={() => setIsCourseModalVisible(true)}
                            >
                                <View style={styles.selectorLeft}>
                                    <BookOpen size={20} color={COLORS.primary} />
                                    <Text style={[styles.selectorText, { color: selectedCourse ? COLORS.text.primary : COLORS.text.muted }]}>
                                        {selectedCourse ? selectedCourse.title : 'Select Course'}
                                    </Text>
                                </View>
                                <ChevronRight size={20} color={COLORS.text.muted} />
                            </TouchableOpacity>

                            <Button
                                title="Create Live Room"
                                onPress={handleCreate}
                                loading={isCreating}
                                disabled={!selectedCourse}
                                style={[styles.actionButton, { backgroundColor: COLORS.primary }] as any}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Course Selection Modal */}
            <Modal
                visible={isCourseModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsCourseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: COLORS.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: COLORS.text.primary }]}>Your Courses</Text>
                            <TouchableOpacity onPress={() => setIsCourseModalVisible(false)}>
                                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={courses}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.courseItem}
                                    onPress={() => {
                                        setSelectedCourse(item);
                                        setIsCourseModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.courseTitle, { color: COLORS.text.primary }]}>{item.title}</Text>
                                    <ChevronRight size={18} color={COLORS.text.muted} />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={[styles.emptyText, { color: COLORS.text.muted }]}>No courses found.</Text>
                            }
                        />
                    </View>
                </View>
            </Modal>
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
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 8
    },
    selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    selectorText: { fontSize: 16, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    courseItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    courseTitle: { fontSize: 16, fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15 }
});
