import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTaskStore } from '@/features/tasks/store/taskStore';
import { TaskSortBy } from '@/features/tasks/utils/taskListUtils';
import { haptics } from '@/lib/haptics';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const SORT_OPTIONS: TaskSortBy[] = ['manual', 'dueDate', 'priority', 'created'];

interface TaskListSortBarProps {
  initialExpanded?: boolean;
}

export function TaskListSortBar({ initialExpanded = false }: TaskListSortBarProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const sortBy = useTaskStore((state) => state.sortBy);
  const groupByDate = useTaskStore((state) => state.groupByDate);
  const setSortBy = useTaskStore((state) => state.setSortBy);
  const setGroupByDate = useTaskStore((state) => state.setGroupByDate);
  const [expanded, setExpanded] = useState(initialExpanded);

  const hasActiveOptions = sortBy !== 'manual' || !groupByDate;

  const toggleExpanded = () => {
    haptics.light();
    setExpanded((value) => !value);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
        style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
      >
        <View style={styles.toggleLeft}>
          <Ionicons name="options-outline" size={16} color={colors.textMuted} />
          <Text style={styles.toggleLabel}>
            {expanded ? t('sort.lessFilters') : t('sort.moreFilters')}
          </Text>
          {hasActiveOptions && !expanded ? <View style={styles.activeDot} /> : null}
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.panel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortRow}
          >
            {SORT_OPTIONS.map((option) => {
              const selected = sortBy === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    haptics.light();
                    setSortBy(option);
                  }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {t(`sort.${option}`)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: groupByDate }}
            onPress={() => {
              haptics.light();
              setGroupByDate(!groupByDate);
            }}
            style={[styles.groupToggle, groupByDate && styles.groupToggleOn]}
          >
            <Text style={[styles.groupLabel, groupByDate && styles.groupLabelOn]}>
              {t('sort.groupByDate')}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      gap: spacing.sm,
    },
    toggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      height: 38,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    togglePressed: {
      opacity: 0.85,
    },
    toggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    toggleLabel: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: c.primary,
    },
    panel: {
      gap: spacing.sm,
      paddingTop: spacing.xs,
    },
    sortRow: {
      gap: spacing.sm,
      paddingRight: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    chipSelected: {
      borderColor: c.primary,
      backgroundColor: `${c.primary}14`,
    },
    chipLabel: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    chipLabelSelected: {
      color: c.primary,
      fontWeight: '700',
    },
    groupToggle: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    groupToggleOn: {
      borderColor: c.primary,
      backgroundColor: `${c.primary}14`,
    },
    groupLabel: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    groupLabelOn: {
      color: c.primary,
      fontWeight: '700',
    },
  });
