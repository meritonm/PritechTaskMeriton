import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ title, message, onRetry }: ErrorViewProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
      <Text style={styles.title}>{title ?? t('errors.genericTitle')}</Text>
      <Text style={styles.message}>{message ?? t('errors.genericMessage')}</Text>
      {onRetry ? <Button label={t('common.retry')} onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: c.text,
      textAlign: 'center',
    },
    message: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
  });
