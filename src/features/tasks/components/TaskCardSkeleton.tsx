import { Animated, StyleSheet, View } from 'react-native';

import { usePulse } from '@/lib/usePulse';
import { colors, radius, shadows, spacing } from '@/theme';

export function TaskCardSkeleton() {
  const pulse = usePulse();

  return (
    <View style={styles.card}>
      <View style={styles.checkbox} />
      <View style={styles.content}>
        <Animated.View style={[styles.line, styles.title, { opacity: pulse }]} />
        <Animated.View style={[styles.line, styles.subtitle, { opacity: pulse }]} />
        <View style={styles.metaRow}>
          <Animated.View style={[styles.pill, { opacity: pulse }]} />
          <Animated.View style={[styles.pillSmall, { opacity: pulse }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
  title: {
    height: 16,
    width: '70%',
  },
  subtitle: {
    height: 12,
    width: '90%',
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  pill: {
    height: 18,
    width: 70,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  pillSmall: {
    height: 18,
    width: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
});
