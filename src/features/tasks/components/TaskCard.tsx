import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { TaskQuickActionsSheet } from '@/features/tasks/components/TaskQuickActionsSheet';
import { useDeleteTaskWithUndo } from '@/features/tasks/hooks/useDeleteTaskWithUndo';
import { Task, TaskDisplayStatus } from '@/features/tasks/types/task.types';
import { getStatusTone, getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { haptics } from '@/lib/haptics';
import { rescheduleTaskReminder } from '@/lib/notifications';
import { useToastStore } from '@/lib/toastStore';
import { radius, shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface TaskCardProps {
  task: Task;
  onDrag?: () => void;
  dragging?: boolean;
  initialSwipeOpen?: boolean;
}

export function TaskCard({ task, onDrag, dragging = false, initialSwipeOpen = false }: TaskCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const showToast = useToastStore((state) => state.show);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const setTaskDisplayStatus = useTaskStore((state) => state.setTaskDisplayStatus);
  const { deleteWithUndo } = useDeleteTaskWithUndo();
  const swipeableRef = useRef<Swipeable>(null);
  const [actionsOpen, setActionsOpen] = useState(false);

  const enter = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (!initialSwipeOpen) {
      return;
    }
    const timer = setTimeout(() => swipeableRef.current?.openRight(), 400);
    return () => clearTimeout(timer);
  }, [initialSwipeOpen]);

  const displayStatus = getTaskDisplayStatus(task);
  const isCompleted = displayStatus === 'completed';
  const isOverdue = displayStatus === 'overdue';
  const priorityColor = colors.priority[task.priority];

  const handleToggle = () => {
    haptics.light();
    toggleTaskStatus(task.id);
    const updated = useTaskStore.getState().tasks.find((item) => item.id === task.id);
    if (updated) {
      void rescheduleTaskReminder(updated);
    }
  };

  const handleStatusSelect = (status: TaskDisplayStatus) => {
    haptics.light();
    setTaskDisplayStatus(task.id, status);
    const updated = useTaskStore.getState().tasks.find((item) => item.id === task.id);
    if (updated) {
      void rescheduleTaskReminder(updated);
    }
    showToast(t('toast.statusUpdated', { title: task.title, status: t(`status.${status}`) }));
  };

  const handleDelete = (confirm = false) => {
    deleteWithUndo(task, { confirm, showUndoToast: !confirm });
  };

  const confirmDelete = () => {
    swipeableRef.current?.close();
    handleDelete(false);
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.6],
      extrapolate: 'clamp',
    });
    return (
      <Pressable style={styles.swipeAction} onPress={confirmDelete} accessibilityRole="button">
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <Ionicons name="trash" size={22} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>{t('common.delete')}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <>
      <Animated.View
        style={{
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
            },
          ],
        }}
      >
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          rightThreshold={40}
          containerStyle={styles.swipeContainer}
        >
          <View
            style={[styles.card, dragging && styles.cardDragging]}
          >
            <View style={[styles.accent, { backgroundColor: priorityColor }]} />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isCompleted }}
              hitSlop={8}
              onPress={handleToggle}
              style={[styles.checkbox, isCompleted && styles.checkboxChecked]}
            >
              {isCompleted ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/task/${task.id}`)}
              onLongPress={() => {
                haptics.light();
                setActionsOpen(true);
              }}
              delayLongPress={280}
              style={({ pressed }) => [styles.contentPressable, pressed && styles.cardPressed]}
            >
              <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={2}>
                  {task.title}
                </Text>
                <Badge label={t(`status.${displayStatus}`)} tone={getStatusTone(displayStatus)} />
              </View>

              {task.description ? (
                <Text style={styles.description} numberOfLines={1}>
                  {task.description}
                </Text>
              ) : null}

              <View style={styles.metaRow}>
                <View style={[styles.priorityPill, { backgroundColor: `${priorityColor}22` }]}>
                  <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {t(`priority.${task.priority}`)}
                  </Text>
                </View>

                {task.dueDate ? (
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={isOverdue ? colors.danger : colors.textMuted}
                    />
                    <Text style={[styles.metaText, isOverdue && styles.metaTextOverdue]}>
                      {format(parseISO(task.dueDate), 'MMM d')}
                    </Text>
                  </View>
                ) : null}

                {task.tags.map((tag) => (
                  <View key={tag} style={styles.metaItem}>
                    <View style={[styles.tagDot, { backgroundColor: colors.tag[tag] }]} />
                    <Text style={styles.metaText}>{t(`tags.${tag}`)}</Text>
                  </View>
                ))}
              </View>
              </View>
            </Pressable>

            {onDrag ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('quickActions.reorder')}
                onLongPress={onDrag}
                delayLongPress={180}
                hitSlop={8}
                style={styles.dragHandle}
              >
                <Ionicons name="reorder-three" size={22} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </Swipeable>
      </Animated.View>

      <TaskQuickActionsSheet
        task={task}
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        onSelectStatus={handleStatusSelect}
        onEdit={() => {
          setActionsOpen(false);
          router.push(`/task/edit/${task.id}`);
        }}
        onDelete={() => {
          setActionsOpen(false);
          handleDelete(true);
        }}
      />
    </>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    swipeContainer: {
      borderRadius: radius.lg,
    },
    swipeAction: {
      backgroundColor: c.danger,
      justifyContent: 'center',
      alignItems: 'center',
      width: 88,
      borderRadius: radius.lg,
      marginLeft: spacing.sm,
    },
    swipeActionText: {
      ...typography.caption,
      color: '#FFFFFF',
      fontWeight: '700',
      marginTop: 2,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: spacing.lg,
      paddingLeft: spacing.lg + spacing.xs,
      paddingRight: spacing.md,
      overflow: 'hidden',
      ...shadows.sm,
    },
    cardPressed: {
      opacity: 0.85,
    },
    cardDragging: {
      borderColor: c.primary,
      ...shadows.lg,
    },
    contentPressable: {
      flex: 1,
    },
    accent: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    checkboxChecked: {
      backgroundColor: c.success,
      borderColor: c.success,
    },
    content: {
      flex: 1,
      gap: 6,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: c.text,
      flex: 1,
      lineHeight: 22,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: c.textSubtle,
    },
    description: {
      ...typography.caption,
      color: c.textMuted,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: 2,
    },
    priorityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
    },
    priorityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    priorityText: {
      ...typography.caption,
      fontSize: 12,
      fontWeight: '700',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    metaText: {
      ...typography.caption,
      fontSize: 12,
      color: c.textMuted,
    },
    metaTextOverdue: {
      color: c.danger,
      fontWeight: '700',
    },
    tagDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    dragHandle: {
      paddingLeft: spacing.xs,
      paddingTop: 2,
      justifyContent: 'center',
    },
  });
