import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type BadgeTone = 'default' | 'success' | 'danger' | 'warning' | 'primary';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

export function Badge({ label, tone = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[tone], style]}>
      <Text style={[styles.label, styles[`${tone}Label` as const]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: colors.border,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  danger: {
    backgroundColor: colors.dangerLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  primary: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  defaultLabel: {
    color: colors.textMuted,
  },
  successLabel: {
    color: colors.success,
  },
  dangerLabel: {
    color: colors.danger,
  },
  warningLabel: {
    color: colors.warning,
  },
  primaryLabel: {
    color: colors.primary,
  },
});
