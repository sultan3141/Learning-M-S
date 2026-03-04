import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Globe, Moon, Shield, Info } from 'lucide-react-native';
import { COLORS_LIGHT, COLORS_DARK, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';

export const GeneralSettingsScreen = () => {
    const navigation = useNavigation();
    const { theme, toggleTheme } = useThemeStore();
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    const [isPushEnabled, setIsPushEnabled] = useState(true);

    const renderSettingItem = (icon: React.ReactNode, title: string, value: any, onValueChange?: (v: any) => void, isSwitch = false) => (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>{icon}</View>
                <Text style={[styles.itemTitle, { color: COLORS.text.primary }]}>{title}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                    thumbColor="#FFFFFF"
                />
            ) : (
                <Text style={[styles.itemValue, { color: COLORS.text.muted }]}>{value}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={COLORS.text.primary} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: COLORS.text.primary }]}>General Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: COLORS.text.muted }]}>Preferences</Text>
                    <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                        {renderSettingItem(<Moon size={20} color={COLORS.primary} />, 'Dark Mode', theme === 'dark', toggleTheme, true)}
                        <View style={[styles.divider, { backgroundColor: COLORS.border }]} />
                        {renderSettingItem(<Globe size={20} color={COLORS.primary} />, 'Language', 'English (US)')}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: COLORS.text.muted }]}>Security & Privacy</Text>
                    <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                        {renderSettingItem(<Shield size={20} color={COLORS.primary} />, 'Privacy Policy', 'View')}
                        <View style={[styles.divider, { backgroundColor: COLORS.border }]} />
                        {renderSettingItem(<Info size={20} color={COLORS.primary} />, 'App Version', '1.0.4 (Build 42)')}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { ...TYPOGRAPHY.h3 },
    content: { padding: SPACING.lg },
    section: { marginBottom: SPACING.xl },
    sectionTitle: {
        ...TYPOGRAPHY.meta,
        marginBottom: SPACING.xs,
        paddingHorizontal: SPACING.xs,
        textTransform: 'uppercase',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: { ...TYPOGRAPHY.body2, fontWeight: '500' },
    itemValue: { ...TYPOGRAPHY.meta },
    divider: { height: 1, marginLeft: 52 },
});
