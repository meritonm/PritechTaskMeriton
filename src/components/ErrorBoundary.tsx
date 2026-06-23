import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${colors.danger}18` }]}>
        <Ionicons name="warning-outline" size={36} color={colors.danger} />
      </View>
      <Text style={styles.title}>{t('errors.genericTitle')}</Text>
      <Text style={styles.message}>{t('errors.genericMessage')}</Text>
      <Button label={t('common.retry')} icon="refresh-outline" onPress={onReset} />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
      backgroundColor: c.background,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.title,
      color: c.text,
      textAlign: 'center',
    },
    message: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
  });
