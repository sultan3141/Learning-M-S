import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PhoneOff, MicOff, VideoOff, MessageSquare, Send } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { useThemeStore } from '../../store/useThemeStore';

import { useAuthStore } from '../../store/useAuthStore';

export const LiveRoomScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { theme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const roomId = (route.params as any)?.roomId || 'Unknown Room';
    const { user } = useAuthStore();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', user: 'System', text: 'Welcome to the live session!', isSystem: true, isOwn: false },
        { id: '2', user: 'Sarah Jenkins', text: 'Hello everyone, we will begin shortly.', isSystem: false, isOwn: false },
    ]);

    const handleLeave = () => {
        navigation.goBack();
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now().toString(),
            user: user?.name.split(' ')[0] || 'Me',
            text: message,
            isSystem: false,
            isOwn: true
        }]);
        setMessage('');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Video Area (Mock) */}
                <View style={[styles.videoContainer, { paddingTop: insets.top }]}>
                    <View style={styles.videoPlaceholder}>
                        <Text style={[styles.videoText, { color: '#FFFFFF' }]}>Teacher Video Stream</Text>
                        <Text style={[styles.videoSubtext, { color: 'rgba(255,255,255,0.6)' }]}>Room: {roomId}</Text>
                    </View>

                    {/* Controls Overlay */}
                    <View style={styles.controlsRow}>
                        <TouchableOpacity style={styles.controlBtn}>
                            <MicOff color="#FFFFFF" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlBtn}>
                            <VideoOff color="#FFFFFF" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.controlBtn, styles.leaveBtn]} onPress={handleLeave}>
                            <PhoneOff color="#FFFFFF" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Chat Area */}
                <View style={[styles.chatArea, { backgroundColor: COLORS.background }]}>
                    <View style={styles.chatHeader}>
                        <MessageSquare color={COLORS.text.primary} size={20} />
                        <Text style={[styles.chatTitle, { color: COLORS.text.primary }]}>Live Chat</Text>
                    </View>

                    <ScrollView
                        style={styles.messageList}
                        contentContainerStyle={styles.messageListContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <View key={msg.id} style={[
                                styles.messageBubble,
                                msg.isOwn ? styles.messageOwn : [styles.messageOther, { backgroundColor: COLORS.card }],
                                msg.isSystem && styles.messageSystem
                            ]}>
                                {!msg.isSystem && !msg.isOwn && <Text style={[styles.messageUser, { color: COLORS.primary }]}>{msg.user}</Text>}
                                <Text style={[
                                    styles.messageText,
                                    { color: msg.isOwn ? '#FFFFFF' : COLORS.text.primary },
                                    msg.isSystem && [styles.messageSystemText, { color: COLORS.text.muted }],
                                ]}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={[styles.inputArea, { borderTopColor: COLORS.border }]}>
                        <Input
                            label=""
                            placeholder="Type a message..."
                            value={message}
                            onChangeText={setMessage}
                            style={styles.chatInput}
                        />
                        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={!message.trim()}>
                            <Send color={message.trim() ? COLORS.primary : COLORS.text.muted} size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1 },
    videoContainer: { flex: 0.45, position: 'relative' },
    videoPlaceholder: { flex: 1, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
    videoText: { fontSize: 18, fontWeight: '600' },
    videoSubtext: { fontSize: 13, marginTop: 4 },
    controlsRow: { position: 'absolute', bottom: SPACING.lg, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg },
    controlBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    leaveBtn: { backgroundColor: '#EF4444' },
    chatArea: { flex: 0.55, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 0 },
    chatHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
    chatTitle: { fontSize: 16, fontWeight: '600' },
    messageList: { flex: 1 },
    messageListContent: { paddingBottom: SPACING.xl, gap: SPACING.md },
    messageBubble: { maxWidth: '80%', padding: SPACING.md, borderRadius: 16 },
    messageOther: { alignSelf: 'flex-start', borderTopLeftRadius: 4 },
    messageOwn: { backgroundColor: '#4F46E5', alignSelf: 'flex-end', borderTopRightRadius: 4 },
    messageSystem: { alignSelf: 'center', backgroundColor: 'transparent', padding: 0 },
    messageUser: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    messageText: { fontSize: 14 },
    messageSystemText: { fontSize: 12, fontStyle: 'italic' },
    inputArea: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderTopWidth: 1 },
    chatInput: { flex: 1, height: 48, marginBottom: 0 },
    sendBtn: { padding: SPACING.md, marginLeft: SPACING.sm },
});
