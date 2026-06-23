import { format, parseISO } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorView } from '@/components/ui/ErrorView';
import { Screen } from '@/components/ui/Screen';
import { TaskHistory } from '@/features/tasks/components/TaskHistory';
import { TaskReminderPanel } from '@/features/tasks/components/TaskReminderPanel';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { getStatusTone, getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { haptics } from '@/lib/haptics';
import { cancelTaskReminder, rescheduleTaskReminder } from '@/lib/notifications';
import { radius, shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  if (!task) {
    return (
      <Screen>
        <ErrorView
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundMessage')}
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }

  const displayStatus = getTaskDisplayStatus(task);
  const isHighPriority = task.priority === 'high';

  const handleDelete = () => {
    Alert.alert(t('alerts.deleteTitle'), t('alerts.deleteMessage', { title: task.title }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          haptics.warning();
          void cancelTaskReminder(task.id);
          deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isHighPriority && styles.highPriorityCard]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{task.title}</Text>
            <Badge label={t(`status.${displayStatus}`)} tone={getStatusTone(displayStatus)} />
          </View>

          <Text style={styles.sectionLabel}>{t('detail.descriptionLabel')}</Text>
          <Text style={styles.body}>{task.description || t('detail.noDescription')}</Text>

          <View style={styles.infoGrid}>
            <InfoItem
              icon="flag-outline"
              label={t('detail.priorityLabel')}
              value={t(`priority.${task.priority}`)}
              valueColor={colors.priority[task.priority]}
            />
            <InfoItem
              icon="calendar-outline"
              label={t('detail.dueDateLabel')}
              value={task.dueDate ? format(parseISO(task.dueDate), 'PPP') : t('detail.noDueDate')}
              valueColor={displayStatus === 'overdue' ? colors.danger : colors.text}
            />
            <InfoItem
              icon="time-outline"
              label={t('detail.createdLabel')}
              value={format(parseISO(task.createdAt), 'PPP')}
            />
          </View>

          {task.tags.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>{t('detail.tagsLabel')}</Text>
              <View style={styles.tagsRow}>
                {task.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: `${colors.tag[tag]}22` }]}>
                    <Text style={[styles.tagText, { color: colors.tag[tag] }]}>
                      {t(`tags.${tag}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>

        <TaskReminderPanel task={task} />

        <TaskHistory history={task.history} />

        <View style={styles.actions}>
          <Button
            label={task.status === 'completed' ? t('detail.markPending') : t('detail.markCompleted')}
            icon={task.status === 'completed' ? 'arrow-undo-outline' : 'checkmark-done-outline'}
            onPress={() => {
              haptics.light();
              toggleTaskStatus(task.id);
              const updated = useTaskStore.getState().tasks.find((item) => item.id === task.id);
              if (updated) {
                void rescheduleTaskReminder(updated);
              }
            }}
          />
          <Button
            label={t('detail.editTask')}
            icon="create-outline"
            variant="secondary"
            onPress={() => router.push(`/task/edit/${task.id}`)}
          />
          <Button
            label={t('detail.deleteTask')}
            icon="trash-outline"
            variant="danger"
            onPress={handleDelete}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoItem({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoLabelRow}>
        <Ionicons name={icon} size={16} color={colors.textMuted} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: valueColor ?? colors.text }]}>{value}</Text>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.lg,
      gap: spacing.md,
      ...shadows.sm,
    },
    highPriorityCard: {
      borderColor: c.danger,
      borderWidth: 1.5,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    title: {
      ...typography.title,
      color: c.text,
      flex: 1,
    },
    sectionLabel: {
      ...typography.label,
      color: c.textMuted,
    },
    body: {
      ...typography.body,
      color: c.text,
      lineHeight: 24,
    },
    infoGrid: {
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    infoItem: {
      gap: spacing.xs,
    },
    infoLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    infoLabel: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    infoValue: {
      ...typography.body,
      fontWeight: '500',
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      borderRadius: 999,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    tagText: {
      ...typography.caption,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    actions: {
      gap: spacing.md,
    },
  });
