import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, shadows, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    section: {
      gap: spacing.sm,
    },
    header: {
      gap: 2,
      paddingHorizontal: spacing.xs,
    },
    title: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    description: {
      ...typography.caption,
      color: c.textSubtle,
      lineHeight: 18,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
      ...shadows.sm,
    },
  });
