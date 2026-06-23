import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DateTimePickerModal } from '@/components/ui/DateTimePickerModal';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface DatePickerFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
  autoOpen?: boolean;
}

export function DatePickerField({ label, value, onChange, error, autoOpen = false }: DatePickerFieldProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [showPicker, setShowPicker] = useState(autoOpen);
  const selectedDate = value ? parseISO(value) : new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={[styles.input, error ? styles.inputError : null]}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={[styles.value, !value && styles.placeholder]}>
            {value ? format(parseISO(value), 'PPP') : t('form.dueDatePlaceholder')}
          </Text>
        </Pressable>
        {value ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onChange(null)}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <DateTimePickerModal
        visible={showPicker}
        mode="date"
        value={selectedDate}
        onConfirm={(date) => {
          onChange(format(date, 'yyyy-MM-dd'));
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
      gap: spacing.xs,
    },
    label: {
      ...typography.label,
      color: c.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    input: {
      flex: 1,
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
    inputError: {
      borderColor: c.danger,
    },
    value: {
      ...typography.body,
      color: c.text,
      flex: 1,
    },
    placeholder: {
      color: c.textMuted,
    },
    clearButton: {
      padding: spacing.xs,
    },
    error: {
      ...typography.caption,
      color: c.danger,
    },
  });
