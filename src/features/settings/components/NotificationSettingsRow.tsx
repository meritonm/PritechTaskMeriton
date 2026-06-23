import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { haptics } from '@/lib/haptics';
import {
  NotificationPermissionStatus,
  openNotificationSettings,
} from '@/lib/notifications';
import { useNotificationPermission } from '@/lib/useNotificationPermission';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const STATUS_TONE = {
  granted: 'success',
  denied: 'danger',
  undetermined: 'warning',
} as const;

export function NotificationSettingsRow() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { status, loading, refresh, request } = useNotificationPermission();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleRequest = () => {
    haptics.light();
    void request();
  };

  const handleOpenSettings = () => {
    haptics.light();
    openNotificationSettings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}14` }]}>
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{t('settings.notifications.rowTitle')}</Text>
          <StatusBadge status={status} loading={loading} />
        </View>
      </View>

      <Text style={styles.hint}>{t(`settings.notifications.hint.${status}`)}</Text>

      <View style={styles.actions}>
        {status === 'undetermined' ? (
          <Button
            label={t('settings.notifications.requestPermission')}
            icon="notifications-outline"
            onPress={handleRequest}
            loading={loading}
          />
        ) : null}

        {status === 'denied' ? (
          <Button
            label={t('settings.notifications.openSettings')}
            icon="open-outline"
            variant="secondary"
            onPress={handleOpenSettings}
          />
        ) : null}

        {status === 'granted' ? (
          <Pressable
            accessibilityRole="button"
            onPress={handleOpenSettings}
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
          >
            <Text style={styles.linkLabel}>{t('settings.notifications.manageInSettings')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function StatusBadge({
  status,
  loading,
}: {
  status: NotificationPermissionStatus;
  loading: boolean;
}) {
  const { t } = useTranslation();

  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <Badge
      label={t(`settings.notifications.status.${status}`)}
      tone={STATUS_TONE[status]}
    />
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
    hint: {
      ...typography.caption,
      color: c.textMuted,
      lineHeight: 18,
    },
    actions: {
      gap: spacing.sm,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
    },
    linkPressed: {
      opacity: 0.7,
    },
    linkLabel: {
      ...typography.body,
      color: c.primary,
      fontWeight: '600',
    },
  });
