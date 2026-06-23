import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

export function AppSplashScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.logoRing}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-done" size={36} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.title}>{t('splash.title')}</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
        <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    logoRing: {
      width: 104,
      height: 104,
      borderRadius: 52,
      backgroundColor: c.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    logo: {
      width: 72,
      height: 72,
      borderRadius: radius.lg,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.md,
    },
    title: {
      ...typography.title,
      fontSize: 24,
      fontWeight: '700',
      color: c.text,
      textAlign: 'center',
    },
    tagline: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
    },
    loader: {
      marginTop: spacing.lg,
    },
  });
