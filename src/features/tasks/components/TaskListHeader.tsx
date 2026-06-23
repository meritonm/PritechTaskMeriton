import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ImportSampleButton } from '@/features/tasks/components/ImportSampleButton';
import { LanguageSwitcher } from '@/features/settings/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/features/settings/components/ThemeSwitcher';
import { radius, shadows, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

interface TaskListHeaderProps {
  taskCount: number;
  showImport: boolean;
}

const NARROW_BREAKPOINT = 380;

export function TaskListHeader({ taskCount, showImport }: TaskListHeaderProps) {
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
        <View style={styles.headerActions}>
          <ThemeSwitcher compact={isNarrow} />
          <LanguageSwitcher compact={isNarrow} />
        </View>
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 0,
      gap: spacing.xs,
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
