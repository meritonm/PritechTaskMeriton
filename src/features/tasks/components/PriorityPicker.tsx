import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TASK_PRIORITIES } from '@/features/tasks/schemas/task.schema';
import { TaskPriority } from '@/features/tasks/types/task.types';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface PriorityPickerProps {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
}

export function PriorityPicker({ value, onChange }: PriorityPickerProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('priority.label')}</Text>
      <View style={styles.row}>
        {TASK_PRIORITIES.map((priority) => {
          const selected = value === priority;
          return (
            <Pressable
              key={priority}
              accessibilityRole="button"
              onPress={() => onChange(priority)}
              style={[
                styles.chip,
                selected && styles.chipSelected,
                selected && { borderColor: colors.priority[priority] },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: colors.priority[priority] }]} />
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {t(`priority.${priority}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      ...typography.label,
      color: c.text,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    chip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
    },
    chipSelected: {
      backgroundColor: c.primaryLight,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    chipLabel: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '500',
    },
    chipLabelSelected: {
      color: c.text,
      fontWeight: '600',
    },
  });
