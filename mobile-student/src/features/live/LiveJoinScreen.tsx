import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Video } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const LiveJoinScreen = () => {
    const navigation = useNavigation();
    const { theme } = useThemeStore();
    const { isAuthenticated } = useAuthStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [roomCode, setRoomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = () => {
        if (!roomCode.trim()) return;

        if (!isAuthenticated) {
            (navigation as any).navigate('Login');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            (navigation as any).navigate('LiveRoom', { roomId: roomCode });
        }, 800);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text.primary} size={24} />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1591104711683-021abc3c1d3b?q=80&w=400' }}
                            style={styles.joinImage}
                        />
                    </View>
                    <Text style={[styles.title, { color: COLORS.text.primary }]}>Join Live Session</Text>
                    <Text style={[styles.subtitle, { color: COLORS.text.secondary }]}>Enter the room code provided by your instructor to join the live class.</Text>

                    <Input
                        label="Room Code"
                        placeholder="e.g. 123-456"
                        value={roomCode}
                        onChangeText={setRoomCode}
                        autoCapitalize="characters"
                    />

                    <Button
                        title="Join Room"
                        onPress={handleJoin}
                        loading={isLoading}
                        disabled={roomCode.trim().length === 0}
                        style={styles.joinButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: { padding: SPACING.lg },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    keyboardView: { flex: 1 },
    content: { flex: 1, padding: SPACING.xl, justifyContent: 'center', marginTop: -60 },
    iconContainer: {
        width: 96, height: 96, borderRadius: 48,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.xl
    },
    joinImage: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
    },
    title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.sm },
    subtitle: { fontSize: 15, textAlign: 'center', marginBottom: SPACING.xxl, paddingHorizontal: SPACING.lg },
    joinButton: { marginTop: SPACING.xl, height: 56 },
});
