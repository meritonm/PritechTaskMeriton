import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { TaskHistoryEntry, TaskHistoryType } from '@/features/tasks/types/task.types';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const ICONS: Record<TaskHistoryType, keyof typeof Ionicons.glyphMap> = {
  created: 'add-circle',
  updated: 'create',
  completed: 'checkmark-circle',
  reopened: 'arrow-undo-circle',
};

interface TaskHistoryProps {
  history: TaskHistoryEntry[];
}

export function TaskHistory({ history }: TaskHistoryProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  if (history.length === 0) {
    return null;
  }

  const toneFor = (type: TaskHistoryType): string => {
    if (type === 'completed') return colors.success;
    if (type === 'reopened') return colors.warning;
    if (type === 'created') return colors.primary;
    return colors.textMuted;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>{t('detail.historyLabel')}</Text>
      <View style={styles.timeline}>
        {history.map((entry, index) => {
          const isLast = index === history.length - 1;
          const tone = toneFor(entry.type);
          const fieldsText = entry.fields
            ?.map((field) => t(`fields.${field}`))
            .join(', ');
          return (
            <View key={entry.id} style={styles.row}>
              <View style={styles.markerColumn}>
                <View style={[styles.dot, { backgroundColor: tone }]}>
                  <Ionicons name={ICONS[entry.type]} size={12} color="#FFFFFF" />
                </View>
                {!isLast ? <View style={styles.connector} /> : null}
              </View>
              <View style={styles.entryBody}>
                <Text style={styles.entryTitle}>
                  {t(`history.${entry.type}`)}
                  {fieldsText ? <Text style={styles.entryFields}> · {fieldsText}</Text> : null}
                </Text>
                <Text style={styles.entryTime}>
                  {format(parseISO(entry.timestamp), 'PPp')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.lg,
      gap: spacing.md,
    },
    sectionLabel: {
      ...typography.label,
      color: c.textMuted,
    },
    timeline: {
      gap: 0,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    markerColumn: {
      alignItems: 'center',
      width: 24,
    },
    dot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    connector: {
      flex: 1,
      width: 2,
      backgroundColor: c.border,
      marginVertical: 2,
      minHeight: 14,
    },
    entryBody: {
      flex: 1,
      paddingBottom: spacing.md,
    },
    entryTitle: {
      ...typography.body,
      color: c.text,
      fontWeight: '600',
    },
    entryFields: {
      ...typography.body,
      color: c.textMuted,
      fontWeight: '400',
    },
    entryTime: {
      ...typography.caption,
      color: c.textMuted,
      marginTop: 2,
    },
  });
