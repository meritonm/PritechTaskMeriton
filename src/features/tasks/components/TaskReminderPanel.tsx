import { format, parse } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Task } from '@/features/tasks/types/task.types';
import { formatReminderSchedule, getTaskReminderFireAt } from '@/lib/notifications';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface TaskReminderPanelProps {
  task: Task;
}

export function TaskReminderPanel({ task }: TaskReminderPanelProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const reminderTimeLabel = task.reminderTime
    ? format(parse(task.reminderTime, 'HH:mm', new Date()), 'p')
    : null;

  const fireAt = task.reminderEnabled ? getTaskReminderFireAt(task) : null;
  const scheduleLabel = fireAt
    ? t('detail.reminderScheduled', { title: task.title, ...formatReminderSchedule(fireAt) })
    : task.reminderEnabled
      ? t('detail.reminderPast')
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={18} color={colors.primary} />
        <Text style={styles.title}>{t('detail.reminderLabel')}</Text>
      </View>

      {!task.dueDate ? (
        <Text style={styles.muted}>{t('detail.reminderNeedsDueDate')}</Text>
      ) : (
        <>
          <View style={styles.statusRow}>
            <Text style={styles.label}>{t('detail.reminderStatus')}</Text>
            <Text style={[styles.value, task.reminderEnabled ? styles.on : styles.off]}>
              {task.reminderEnabled ? t('detail.reminderOn') : t('detail.reminderOff')}
            </Text>
          </View>

          {task.reminderEnabled && reminderTimeLabel ? (
            <View style={styles.statusRow}>
              <Text style={styles.label}>{t('detail.reminderAt')}</Text>
              <Text style={styles.value}>{reminderTimeLabel}</Text>
            </View>
          ) : null}

          {scheduleLabel ? (
            <Text style={[styles.muted, task.reminderEnabled && !fireAt ? styles.warning : null]}>
              {scheduleLabel}
            </Text>
          ) : null}
        </>
      )}

      <Button
        label={task.dueDate ? t('detail.editReminder') : t('detail.addDueDate')}
        icon={task.dueDate ? 'create-outline' : 'calendar-outline'}
        variant="secondary"
        onPress={() => router.push(`/task/edit/${task.id}`)}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.lg,
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    title: {
      ...typography.label,
      color: c.text,
      fontWeight: '700',
    },
    muted: {
      ...typography.body,
      color: c.textMuted,
    },
    warning: {
      color: c.warning,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    value: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
    on: {
      color: c.success,
    },
    off: {
      color: c.textMuted,
    },
  });
