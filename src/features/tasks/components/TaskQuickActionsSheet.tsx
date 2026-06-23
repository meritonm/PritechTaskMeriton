import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Task, TaskDisplayStatus } from '@/features/tasks/types/task.types';
import { getStatusTone, getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const FADE_MS = 280;
const SLIDE_MS = 320;
const SHEET_OFFSET = 360;

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
  const [mounted, setMounted] = useState(visible);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(SHEET_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      fade.setValue(0);
      slide.setValue(SHEET_OFFSET);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: FADE_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: SLIDE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: SHEET_OFFSET,
        duration: SLIDE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, fade, slide]);

  if (!task || !mounted) {
    return null;
  }

  const currentStatus = getTaskDisplayStatus(task);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdrop,
            { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }) },
          ]}
        />
        <Pressable style={styles.dismissArea} onPress={onClose} accessibilityRole="button" />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slide }] }]}>
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
                  style={[
                    styles.statusChip,
                    selected && { borderColor: toneColor, backgroundColor: `${toneColor}18` },
                  ]}
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000',
    },
    dismissArea: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
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
