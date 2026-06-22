import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useImportSampleTasks } from '@/features/tasks/hooks/useImportSampleTasks';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface ImportSampleButtonProps {
  compact?: boolean;
}

export function ImportSampleButton({ compact = false }: ImportSampleButtonProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { runImport, isImporting } = useImportSampleTasks();

  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isImporting}
        onPress={runImport}
        style={({ pressed }) => [styles.compact, pressed && styles.compactPressed]}
      >
        {isImporting ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="cloud-download-outline" size={16} color={colors.primary} />
        )}
        <Text style={styles.compactLabel}>{t('list.importButton')}</Text>
      </Pressable>
    );
  }

  return (
    <Button
      label={isImporting ? t('list.importing') : t('list.importButton')}
      icon="cloud-download-outline"
      onPress={runImport}
      variant="secondary"
      loading={isImporting}
    />
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    compact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: c.primaryLight,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    compactPressed: {
      opacity: 0.7,
    },
    compactLabel: {
      ...typography.caption,
      color: c.primary,
      fontWeight: '600',
    },
  });
