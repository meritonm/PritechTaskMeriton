import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TASK_TAGS } from '@/features/tasks/schemas/task.schema';
import { TaskTag } from '@/features/tasks/types/task.types';
import { colors, spacing, typography } from '@/theme';

interface TagPickerProps {
  value: TaskTag[];
  onChange: (value: TaskTag[]) => void;
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  const { t } = useTranslation();

  const toggleTag = (tag: TaskTag) => {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }
    onChange([...value, tag]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('tags.label')}</Text>
      <View style={styles.row}>
        {TASK_TAGS.map((tag) => {
          const selected = value.includes(tag);
          return (
            <Pressable
              key={tag}
              accessibilityRole="button"
              onPress={() => toggleTag(tag)}
              style={[
                styles.chip,
                selected && { backgroundColor: `${colors.tag[tag]}22`, borderColor: colors.tag[tag] },
              ]}
            >
              <Text style={[styles.chipLabel, selected && { color: colors.tag[tag] }]}>
                {t(`tags.${tag}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
