import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';

import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { radius, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

const FILTERS = [
  { key: 'all', labelKey: 'filters.all' },
  { key: 'pending', labelKey: 'filters.pending' },
  { key: 'overdue', labelKey: 'filters.overdue' },
  { key: 'completed', labelKey: 'filters.completed' },
] as const;

export function TaskFilters() {
  const { t } = useTranslation();
  const { statusFilter, setStatusFilter } = useTaskFilters();
  const tasks = useTaskStore((state) => state.tasks);
  const styles = useThemedStyles(createStyles);

  const counts = useMemo(() => {
    const result = { all: tasks.length, pending: 0, overdue: 0, completed: 0 };
    for (const task of tasks) {
      result[getTaskDisplayStatus(task)] += 1;
    }
    return result;
  }, [tasks]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const selected = statusFilter === filter.key;
        const count = counts[filter.key];
        return (
          <Pressable
            key={filter.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setStatusFilter(filter.key)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {t(filter.labelKey)}
            </Text>
            <View style={[styles.countBadge, selected && styles.countBadgeSelected]}>
              <Text style={[styles.countText, selected && styles.countTextSelected]}>{count}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 0,
      flexShrink: 0,
    },
    container: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: spacing.md,
      height: 38,
    },
    chipSelected: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    label: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    labelSelected: {
      color: '#FFFFFF',
    },
    countBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: radius.pill,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceMuted,
    },
    countBadgeSelected: {
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    countText: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
    },
    countTextSelected: {
      color: '#FFFFFF',
    },
  });
