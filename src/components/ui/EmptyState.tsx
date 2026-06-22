import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconOuter}>
        <View style={styles.iconWrap}>
          <Ionicons name="clipboard-outline" size={34} color={colors.primary} />
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} icon="add" onPress={onAction} style={styles.button} />
      ) : null}
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
    iconOuter: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: `${c.primary}0D`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    iconWrap: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: c.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typography.subtitle,
      fontSize: 18,
      color: c.text,
      textAlign: 'center',
    },
    description: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 300,
    },
    button: {
      marginTop: spacing.md,
      alignSelf: 'stretch',
    },
  });
