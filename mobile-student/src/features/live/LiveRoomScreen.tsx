import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
    ActivityIndicator, Dimensions, Animated, Modal, FlatList,
    KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare,
    Send, Users, ChevronDown, MoreHorizontal, Layout,
    Smile, Shield, Hand, Share, Settings, X
} from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../config/api';

// LiveKit imports
import { Room, RoomEvent, Track, VideoView, AudioSession, Participant, RemoteParticipant, LocalParticipant } from '../../lib/livekit';
import * as MediaLibrary from 'expo-media-library';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Simple polyfill for TextEncoder/Decoder if they don't exist in RN environment
const _TextEncoder = typeof TextEncoder !== 'undefined' ? TextEncoder : class {
    encode(str: string) {
        const arr = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
        return arr;
    }
};

const _TextDecoder = typeof TextDecoder !== 'undefined' ? TextDecoder : class {
    decode(arr: Uint8Array) {
        return String.fromCharCode.apply(null, arr as any);
    }
};

/**
 * Zoom-like Live Room Screen
 */
export const LiveRoomScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { theme } = useThemeStore();
    const { token, user, isAuthenticated } = useAuthStore();

    // Theme Constants (Force Dark for imersive feel)
    const ZOOM_COLORS = {
        background: '#000000',
        card: '#1A1A1A',
        primary: '#0E71EB', // Zoom Blue
        danger: '#FF3B30',  // Zoom Red
        text: '#FFFFFF',
        textMuted: '#A1A1A1',
        overlay: 'rgba(0, 0, 0, 0.6)',
        border: 'rgba(255, 255, 255, 0.1)'
    };

    const roomCode = (route.params as any)?.roomId || (route.params as any)?.roomCode;

    // --- LiveKit state ---
    const [room] = useState(() => {
        try {
            if (typeof Room === 'undefined') return null;
            return new Room();
        } catch (e) {
            console.error('Failed to instantiate LiveKit Room:', e);
            return null;
        }
    });

    const [isConnecting, setIsConnecting] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isCameraEnabled, setIsCameraEnabled] = useState(true);
    const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // --- UI state ---
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isParticipantsVisible, setIsParticipantsVisible] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'gallery' | 'speaker'>('gallery');

    const controlsAnimation = useRef(new Animated.Value(1)).current;
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);

    // --- Chat state ---
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([
        { id: '1', user: 'Sheikh Abdullah', text: 'Assalamu Alaikum everyone, welcome to today\'s session on the Quranic studies.', isOwn: false },
        { id: '2', user: 'Sister Fatima (Admin)', text: 'The recording has been started. Please keep your mics muted unless speaking.', isOwn: false }
    ]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigation.replace('Login');
            return;
        }

        if (!roomCode) {
            Alert.alert('Error', 'No room code provided');
            navigation.goBack();
            return;
        }

        if (!room) {
            Alert.alert('Initialization Error', 'LiveKit could not be initialized.');
            navigation.goBack();
            return;
        }

        connectToRoom();

        // Auto-hide controls after 5 seconds
        startHideTimer();

        return () => {
            room.disconnect();
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        };
    }, [roomCode, room]);

    const startHideTimer = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
            toggleControls(false);
        }, 5000);
    };

    const toggleControls = (visible: boolean) => {
        setIsControlsVisible(visible);
        Animated.timing(controlsAnimation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();

        if (visible) startHideTimer();
    };

    const connectToRoom = async () => {
        try {
            setIsConnecting(true);
            const response = await api.post(`/live-sessions/${roomCode}/join`);
            const { token: livekitToken, url: livekitUrl } = response.data;

            await AudioSession.startAudioSession();
            await room?.connect(livekitUrl, livekitToken);

            setIsConnected(true);
            setIsConnecting(false);

            room?.on(RoomEvent.ParticipantConnected, () => updateParticipants());
            room?.on(RoomEvent.ParticipantDisconnected, () => updateParticipants());
            room?.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
                if (speakers.length > 0) setActiveSpeaker(speakers[0].identity);
                else setActiveSpeaker(null);
            });
            room?.on(RoomEvent.DataReceived, (payload: Uint8Array, participant: Participant) => {
                try {
                    const decoded = new _TextDecoder().decode(payload);
                    const data = JSON.parse(decoded);
                    if (data.type === 'chat') {
                        // Avoid duplicates from echo/re-connect
                        setMessages((prev) => {
                            if (prev.find((m: any) => m.id === data.id)) return prev;
                            return [...prev, { ...data, isOwn: false }];
                        });
                    }
                } catch (e) {
                    console.error('Chat decode error:', e);
                }
            });

            updateParticipants();

            // Start recording automatically if Teacher
            if (user?.role === 'TEACHER') {
                room?.startRecording?.();
                setIsRecording(true);
            }
        } catch (err: any) {
            console.error('Failed to connect:', err);
            setIsConnecting(false);
            Alert.alert('Connection Failed', err.response?.data?.message || 'Could not connect.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        }
    };

    const updateParticipants = useCallback(() => {
        if (!room) return;
        const all = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
        setParticipants(all);
    }, [room]);

    const toggleMic = async () => {
        const enabled = !isMicEnabled;
        await room?.localParticipant.setMicrophoneEnabled(enabled);
        setIsMicEnabled(enabled);
        startHideTimer();
    };

    const toggleCamera = async () => {
        const enabled = !isCameraEnabled;
        await room?.localParticipant.setCameraEnabled(enabled);
        setIsCameraEnabled(enabled);
        startHideTimer();
    };

    const toggleScreenShare = async () => {
        const enabled = !isScreenSharing;
        // @ts-ignore
        await room?.localParticipant.setScreenShareEnabled?.(enabled);
        setIsScreenSharing(enabled);
        if (enabled) {
            Alert.alert('Screen Sharing', 'You are now sharing your screen with the class.');
        }
    };

    const handleLeave = async () => {
        if (isScreenSharing) {
            // @ts-ignore
            await room?.localParticipant.setScreenShareEnabled?.(false);
        }
        if (user?.role === 'TEACHER' && isRecording) {
            const videoUri = await room?.stopRecording?.();
            setIsRecording(false);

            // Request permission to save to gallery
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted' && videoUri) {
                try {
                    // On a real device, this saves the video file to the Gallery
                    await MediaLibrary.saveToLibraryAsync(videoUri);
                    Alert.alert(
                        'Saved to Gallery',
                        'The live session has been recorded and saved to your device gallery.',
                        [{
                            text: 'Close', onPress: async () => {
                                await room?.disconnect();
                                await AudioSession.stopAudioSession();
                                navigation.goBack();
                            }
                        }]
                    );
                } catch (e) {
                    console.error('Failed to save to gallery:', e);
                    Alert.alert('Save Failed', 'Recording was stopped, but could not be saved to your gallery.');
                }
            } else {
                Alert.alert(
                    'Permission Required',
                    'Storage permission is needed to save the recording to your gallery.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
            return;
        }
        await room?.disconnect();
        await AudioSession.stopAudioSession();
        navigation.goBack();
    };

    const sendMessage = async () => {
        if (!message.trim() || !room) return;
        const chatMessage = {
            type: 'chat',
            id: Date.now().toString(),
            user: user?.fullName ? `${user.fullName} (You)` : 'Me (You)',
            text: message.trim()
        };

        try {
            const encoded = new _TextEncoder().encode(JSON.stringify(chatMessage));
            await room.localParticipant.publishData(encoded, { reliable: true });
            setMessages((prev) => [...prev, { ...chatMessage, isOwn: true }]);
            setMessage('');
        } catch (e) {
            console.error('Send error:', e);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    // --- Sub-components ---

    const ParticipantViewComponent = ({ participant, size = 'large' }: { participant: Participant, size?: 'small' | 'medium' | 'large' }) => {
        const videoTrack = participant.videoTrackPublications.values().next().value?.track;
        const isActive = activeSpeaker === participant.identity;
        const isLocal = (participant as any).isLocal;

        // Choice of Islamic background based on identity char code for variance
        const bgIndex = (participant.identity.charCodeAt(0) || 0) % 3;
        const fallbackImages = [
            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop', // Quran
            'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?q=80&w=600&auto=format&fit=crop', // Mosque
            'https://images.unsplash.com/photo-1584281723506-6927a4e62211?q=80&w=600&auto=format&fit=crop'  // Art
        ];

        return (
            <View style={[
                styles.participantBox,
                size === 'small' && styles.participantBoxSmall,
                isActive && styles.activeSpeakerBorder
            ]}>
                {videoTrack ? (
                    <VideoView
                        style={styles.videoFill}
                        videoTrack={videoTrack}
                        mirror={isLocal}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Image
                            source={{ uri: fallbackImages[bgIndex] }}
                            style={StyleSheet.absoluteFill}
                            blurRadius={2}
                        />
                        <View style={styles.avatarOverlay} />
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarChar}>{participant.identity?.charAt(0)?.toUpperCase() || '?'}</Text>
                        </View>
                        <Text style={styles.placeholderName}>{isLocal ? 'Me' : participant.identity}</Text>
                    </View>
                )}

                <View style={styles.participantLabel}>
                    {!participant.isMicrophoneEnabled && (
                        <MicOff color={ZOOM_COLORS.danger} size={12} style={{ marginRight: 4 }} />
                    )}
                    <Text style={styles.labelName} numberOfLines={1}>
                        {isLocal ? 'Me' : participant.identity}
                    </Text>
                </View>
            </View>
        );
    };

    if (isConnecting) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: '#000' }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ZOOM_COLORS.primary} />
                    <Text style={styles.loadingText}>Connecting to Live Room...</Text>
                    <Text style={styles.loadingSubtext}>Room: {roomCode}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.fullScreen}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.fullScreen}
                onPress={() => toggleControls(!isControlsVisible)}
            >
                {/* Main Video Area */}
                <View style={styles.videoArea}>
                    {isScreenSharing && (
                        <View style={styles.sharingOverlay}>
                            <Share color="#FFF" size={48} />
                            <Text style={styles.sharingText}>You are sharing your screen</Text>
                            <TouchableOpacity
                                style={styles.stopSharingBtn}
                                onPress={toggleScreenShare}
                            >
                                <Text style={styles.stopSharingText}>Stop Sharing</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {layoutMode === 'gallery' ? (
                        <View style={styles.galleryGrid}>
                            {participants.map((p, idx) => (
                                <View key={p.sid || p.identity} style={styles.gridItem}>
                                    <ParticipantViewComponent
                                        participant={p}
                                        size={participants.length > 2 ? 'medium' : 'large'}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.speakerContainer}>
                            {/* Speaker mode... (Simplified for now to prioritize Gallery) */}
                        </View>
                    )}
                </View>

                {/* Top Overlay */}
                <Animated.View style={[
                    styles.topOverlay,
                    {
                        paddingTop: insets.top + SPACING.sm,
                        opacity: controlsAnimation,
                        transform: [{ translateY: controlsAnimation.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }]
                    }
                ]}>
                    <View style={styles.topBar}>
                        <View style={styles.roomInfoBox}>
                            <Text style={styles.roomTitleText}>Live Class: {roomCode}</Text>
                            <View style={styles.statusBadge}>
                                <View style={styles.redDot} />
                                <Text style={styles.statusText}>Live</Text>
                            </View>
                            {isRecording && (
                                <View style={[styles.statusBadge, { marginLeft: 8, backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                                    <View style={[styles.redDot, { backgroundColor: '#EF4444' }]} />
                                    <View style={{ width: 4 }} />
                                    <Text style={[styles.statusText, { color: '#EF4444' }]}>Rec</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setLayoutMode(prev => prev === 'gallery' ? 'speaker' : 'gallery')}>
                            <Layout color="#FFF" size={20} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Bottom Overlay (Controls) */}
                <Animated.View style={[
                    styles.bottomOverlay,
                    {
                        paddingBottom: Math.max(insets.bottom, SPACING.lg),
                        opacity: controlsAnimation,
                        transform: [{ translateY: controlsAnimation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }]
                    }
                ]}>
                    <View style={styles.controlBarContainer}>
                        <View style={styles.controlRow}>
                            <ControlBtn
                                icon={isMicEnabled ? Mic : MicOff}
                                label="Mute"
                                color={isMicEnabled ? "#FFF" : ZOOM_COLORS.danger}
                                onPress={toggleMic}
                            />
                            <ControlBtn
                                icon={isCameraEnabled ? Video : VideoOff}
                                label="Stop Video"
                                color={isCameraEnabled ? "#FFF" : ZOOM_COLORS.danger}
                                onPress={toggleCamera}
                            />
                            <ControlBtn
                                icon={Share}
                                label={isScreenSharing ? "Stop Share" : "Share"}
                                color={isScreenSharing ? ZOOM_COLORS.primary : "#FFF"}
                                onPress={toggleScreenShare}
                            />
                            <ControlBtn
                                icon={Users}
                                label="Participants"
                                onPress={() => setIsParticipantsVisible(true)}
                                badge={participants.length}
                            />
                            <ControlBtn
                                icon={MessageSquare}
                                label="Chat"
                                onPress={() => setIsChatVisible(true)}
                                badge={messages.length > 0 ? messages.length : undefined}
                            />
                        </View>
                        <TouchableOpacity style={styles.zoomLeaveBtn} onPress={handleLeave}>
                            <Text style={styles.leaveText}>Leave</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>

            {/* Chat Modal */}
            <Modal visible={isChatVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
                    style={styles.modalFull}
                >
                    <View style={[styles.modalContent, { backgroundColor: ZOOM_COLORS.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>In-Meeting Chat</Text>
                            <TouchableOpacity onPress={() => setIsChatVisible(false)}>
                                <X color="#FFF" size={24} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={[styles.msgContainer, item.isOwn && styles.msgOwn]}>
                                    <Text style={styles.msgUser}>{item.user}</Text>
                                    <View style={[styles.msgBubble, item.isOwn && styles.msgBubbleOwn]}>
                                        <Text style={styles.msgText}>{item.text}</Text>
                                    </View>
                                </View>
                            )}
                            style={styles.msgList}
                        />
                        <View style={styles.msgInputArea}>
                            <Input
                                placeholder="Send a message..."
                                value={message}
                                onChangeText={setMessage}
                                containerStyle={{ flex: 1, marginBottom: 0 }}
                                style={[styles.zoomInput, { color: '#FFF' }]}
                                placeholderTextColor="#888"
                                selectionColor={ZOOM_COLORS.primary}
                                leftIcon={<Smile color="#CCC" size={20} />}
                            />
                            <TouchableOpacity onPress={sendMessage} disabled={!message.trim()}>
                                <Send color={message.trim() ? ZOOM_COLORS.primary : "#444"} size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Participants Modal */}
            <Modal visible={isParticipantsVisible} animationType="slide" transparent>
                <View style={styles.modalFull}>
                    <View style={[styles.modalContent, { backgroundColor: ZOOM_COLORS.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Participants ({participants.length})</Text>
                            <TouchableOpacity onPress={() => setIsParticipantsVisible(false)}>
                                <X color="#FFF" size={24} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={participants}
                            keyExtractor={(item, index) => (item.sid || item.identity || `participant-${index}`)}
                            renderItem={({ item }) => {
                                const isLocal = (item as any).isLocal;
                                return (
                                    <View style={styles.participantListItem}>
                                        <View style={[styles.listAvatar, { backgroundColor: isLocal ? ZOOM_COLORS.primary : '#444' }]}>
                                            <Text style={styles.listAvatarText}>{(item.identity || (isLocal ? 'Me' : 'P')).charAt(0).toUpperCase()}</Text>
                                        </View>
                                        <View style={styles.participantListInfo}>
                                            <Text style={styles.participantListName}>
                                                {isLocal ? 'Me' : item.identity}
                                                {isLocal && (
                                                    <Text style={{ color: ZOOM_COLORS.textMuted, fontWeight: 'normal' }}> (Host)</Text>
                                                )}
                                            </Text>
                                        </View>
                                        <View style={styles.participantListActions}>
                                            {item.isMicrophoneEnabled ? <Mic color="#FFF" size={18} /> : <MicOff color={ZOOM_COLORS.danger} size={18} />}
                                            <View style={{ width: 12 }} />
                                            {item.isCameraEnabled ? <Video color="#FFF" size={18} /> : <VideoOff color={ZOOM_COLORS.danger} size={18} />}
                                        </View>
                                    </View>
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        />

                        <View style={styles.participantActionsFooter}>
                            <TouchableOpacity style={styles.footerActionBtn}>
                                <Text style={styles.footerActionText}>Mute All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.footerActionBtn, { backgroundColor: ZOOM_COLORS.primary }]}>
                                <Text style={styles.footerActionText}>Invite</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const ControlBtn = ({ icon: Icon, label, color = "#FFF", onPress, badge }: any) => (
    <TouchableOpacity style={styles.controlGroup} onPress={onPress}>
        <View style={styles.controlIconBox}>
            <Icon color={color} size={24} />
            {badge !== undefined && (
                <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
            )}
        </View>
        <Text style={[styles.controlLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fullScreen: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 20 },
    loadingSubtext: { color: '#AAA', fontSize: 14, marginTop: 8 },

    videoArea: { flex: 1 },
    galleryGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
    gridItem: { width: '50%', height: '33.3%', padding: 2 },
    speakerContainer: { flex: 1 },

    videoFill: { flex: 1, width: '100%', height: '100%', borderRadius: 8 },
    participantBox: { flex: 1, borderRadius: 12, backgroundColor: '#1A1A1A', overflow: 'hidden', position: 'relative' },
    participantBoxSmall: { borderRadius: 8 },
    activeSpeakerBorder: { borderWidth: 2, borderColor: '#0E71EB' },

    avatarPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
    avatarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    avatarChar: { color: '#FFF', fontSize: 24, fontWeight: '700' },
    placeholderName: { color: '#FFF', marginTop: 12, fontSize: 14, fontWeight: '600' },

    participantLabel: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
    labelName: { color: '#FFF', fontSize: 11 },

    topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingBottom: 12 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roomInfoBox: { flexDirection: 'row', alignItems: 'center' },
    roomTitleText: { color: '#FFF', fontSize: 15, fontWeight: '600', marginRight: 8 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    redDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginRight: 6 },
    statusText: { color: '#FFF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },

    bottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 12 },
    controlBarContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
    controlRow: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginRight: 10 },
    controlGroup: { alignItems: 'center', minWidth: 60 },
    controlIconBox: { marginBottom: 4, position: 'relative' },
    controlLabel: { fontSize: 10 },
    badge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#FF3B30', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

    zoomLeaveBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    leaveText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

    modalFull: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { flex: 1, marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },

    msgList: { flex: 1 },
    msgContainer: { marginBottom: 16 },
    msgOwn: { alignItems: 'flex-end' },
    msgUser: { color: '#AAA', fontSize: 12, marginBottom: 4 },
    msgBubble: { backgroundColor: '#333', padding: 12, borderRadius: 12, maxWidth: '85%' },
    msgBubbleOwn: { backgroundColor: '#0E71EB' },
    msgText: { color: '#FFF', fontSize: 14 },

    msgInputArea: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10, paddingBottom: 5 },
    zoomInput: { backgroundColor: '#222', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 0 },

    // Sharing Overlay
    sharingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    sharingText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    stopSharingBtn: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    stopSharingText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Participant List Styles
    participantListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    listAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    listAvatarText: { color: '#FFF', fontWeight: 'bold' },
    participantListInfo: { flex: 1 },
    participantListName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    participantListActions: { flexDirection: 'row', alignItems: 'center' },
    listSeparator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
    participantActionsFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' },
    footerActionBtn: { backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    footerActionText: { color: '#FFF', fontWeight: '600' },
});
