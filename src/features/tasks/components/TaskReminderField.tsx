import { addDays, format, parse } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DateTimePickerModal } from '@/components/ui/DateTimePickerModal';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const DEFAULT_TIME = '09:00';

interface TaskReminderFieldProps {
  enabled: boolean;
  time: string | null;
  dueDate: string | null;
  onEnabledChange: (enabled: boolean) => void;
  onTimeChange: (time: string) => void;
  onDueDateChange: (date: string) => void;
}

function parseTime(value: string | null): Date {
  if (!value) {
    return parse(DEFAULT_TIME, 'HH:mm', new Date());
  }
  return parse(value, 'HH:mm', new Date());
}

export function TaskReminderField({
  enabled,
  time,
  dueDate,
  onEnabledChange,
  onTimeChange,
  onDueDateChange,
}: TaskReminderFieldProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [showPicker, setShowPicker] = useState(false);
  const selectedTime = parseTime(time);

  const handleToggle = (next: boolean) => {
    if (!next) {
      onEnabledChange(false);
      return;
    }

    if (!dueDate) {
      onDueDateChange(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    }
    if (!time) {
      onTimeChange(DEFAULT_TIME);
    }
    onEnabledChange(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('form.reminderLabel')}</Text>
        <Switch
          accessibilityRole="switch"
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={enabled ? colors.primary : colors.surface}
        />
      </View>

      {enabled ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={styles.timeButton}
        >
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={styles.timeLabel}>{t('form.reminderTimeLabel')}</Text>
          <Text style={styles.timeValue}>{format(selectedTime, 'p')}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>
      ) : null}

      <DateTimePickerModal
        visible={showPicker}
        mode="time"
        value={selectedTime}
        onConfirm={(date) => {
          onTimeChange(format(date, 'HH:mm'));
          setShowPicker(false);
        }}
        onDismiss={() => setShowPicker(false)}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      ...typography.label,
      color: c.text,
    },
    timeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    timeLabel: {
      ...typography.body,
      color: c.textMuted,
      flex: 1,
    },
    timeValue: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
  });
