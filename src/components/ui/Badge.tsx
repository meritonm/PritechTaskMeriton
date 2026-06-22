import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

type BadgeTone = 'default' | 'success' | 'danger' | 'warning' | 'primary';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

export function Badge({ label, tone = 'default', style }: BadgeProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.base, styles[tone], style]}>
      <Text style={[styles.label, styles[`${tone}Label` as const]]}>{label}</Text>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    base: {
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    default: {
      backgroundColor: c.border,
    },
    success: {
      backgroundColor: c.successLight,
    },
    danger: {
      backgroundColor: c.dangerLight,
    },
    warning: {
      backgroundColor: c.warningLight,
    },
    primary: {
      backgroundColor: c.primaryLight,
    },
    label: {
      ...typography.caption,
      fontWeight: '600',
    },
    defaultLabel: {
      color: c.textMuted,
    },
    successLabel: {
      color: c.success,
    },
    dangerLabel: {
      color: c.danger,
    },
    warningLabel: {
      color: c.warning,
    },
    primaryLabel: {
      color: c.primary,
    },
  });
