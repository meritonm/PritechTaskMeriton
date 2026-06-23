import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

export function NotificationSettingsRow() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const openSettings = () => {
    haptics.light();
    void Linking.openSettings();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={openSettings}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}14` }]}>
        <Ionicons name="notifications-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{t('settings.notifications.rowTitle')}</Text>
        <Text style={styles.subtitle}>{t('settings.notifications.subtitle')}</Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 2,
      minHeight: 72,
    },
    pressed: {
      backgroundColor: c.surfaceMuted,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
    subtitle: {
      ...typography.caption,
      color: c.textMuted,
      lineHeight: 18,
    },
  });
