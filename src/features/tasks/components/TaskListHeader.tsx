import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ImportSampleButton } from '@/features/tasks/components/ImportSampleButton';
import { radius, shadows, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

interface TaskListHeaderProps {
  taskCount: number;
  showImport: boolean;
}

const NARROW_BREAKPOINT = 380;

export function TaskListHeader({ taskCount, showImport }: TaskListHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const styles = useThemedStyles(createStyles);
  const isNarrow = width < NARROW_BREAKPOINT;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-done" size={isNarrow ? 18 : 20} color="#FFFFFF" />
          </View>
          <Text
            style={[styles.title, isNarrow && styles.titleNarrow]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isNarrow ? t('list.titleShort') : t('list.title')}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsPressed]}
        >
          <Ionicons name="settings-outline" size={22} color={styles.settingsIcon.color} />
        </Pressable>
      </View>

      <View style={styles.headerBottom}>
        <Text style={styles.subtitle} numberOfLines={1}>
          {t('list.subtitle', { count: taskCount })}
        </Text>
        {showImport ? <ImportSampleButton compact /> : null}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
      gap: spacing.xs,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    brand: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    settingsPressed: {
      opacity: 0.7,
    },
    settingsIcon: {
      color: c.text,
    },
    logo: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...shadows.sm,
    },
    title: {
      ...typography.title,
      color: c.text,
      flexShrink: 1,
    },
    titleNarrow: {
      fontSize: 17,
    },
    headerBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    subtitle: {
      ...typography.caption,
      color: c.textMuted,
      flex: 1,
      minWidth: 0,
    },
  });
