import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Task, TaskDisplayStatus } from '@/features/tasks/types/task.types';
import { getStatusTone, getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface TaskQuickActionsSheetProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onSelectStatus: (status: TaskDisplayStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_OPTIONS: TaskDisplayStatus[] = ['pending', 'overdue', 'completed'];

const STATUS_ICONS: Record<TaskDisplayStatus, keyof typeof Ionicons.glyphMap> = {
  pending: 'time-outline',
  overdue: 'alert-circle-outline',
  completed: 'checkmark-circle-outline',
};

export function TaskQuickActionsSheet({
  task,
  visible,
  onClose,
  onSelectStatus,
  onEdit,
  onDelete,
}: TaskQuickActionsSheetProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  if (!task) {
    return null;
  }

  const currentStatus = getTaskDisplayStatus(task);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        <Text style={styles.subtitle}>{t('quickActions.statusTitle')}</Text>

        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((status) => {
            const selected = currentStatus === status;
            const tone = getStatusTone(status);
            const toneColor =
              tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : colors.warning;

            return (
              <Pressable
                key={status}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  onSelectStatus(status);
                  onClose();
                }}
                style={[styles.statusChip, selected && { borderColor: toneColor, backgroundColor: `${toneColor}18` }]}
              >
                <Ionicons name={STATUS_ICONS[status]} size={18} color={toneColor} />
                <Text style={[styles.statusLabel, selected && { color: toneColor, fontWeight: '700' }]}>
                  {t(`status.${status}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Pressable style={styles.action} onPress={onEdit} accessibilityRole="button">
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.actionLabel}>{t('quickActions.edit')}</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={onDelete} accessibilityRole="button">
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.actionLabel, styles.dangerLabel]}>{t('quickActions.delete')}</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onClose} accessibilityRole="button">
          <Text style={styles.cancelLabel}>{t('common.cancel')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
      paddingTop: spacing.sm,
      gap: spacing.md,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      marginBottom: spacing.xs,
    },
    title: {
      ...typography.subtitle,
      color: c.text,
      fontWeight: '700',
    },
    subtitle: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    statusRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    statusChip: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      backgroundColor: c.surfaceMuted,
    },
    statusLabel: {
      ...typography.caption,
      color: c.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    actionLabel: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
    dangerLabel: {
      color: c.danger,
    },
    cancelButton: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    cancelLabel: {
      ...typography.body,
      color: c.textMuted,
      fontWeight: '600',
    },
  });
