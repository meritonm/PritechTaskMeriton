import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Loading...' }: LoadingViewProps) {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    message: {
      ...typography.body,
      color: c.textMuted,
    },
  });
