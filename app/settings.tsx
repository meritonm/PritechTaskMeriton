import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { LanguageSwitcher } from '@/features/settings/components/LanguageSwitcher';
import { NotificationSettingsRow } from '@/features/settings/components/NotificationSettingsRow';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { ThemePreferencePicker } from '@/features/settings/components/ThemePreferencePicker';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: `${colors.primary}18` }]}>
            <Ionicons name="settings-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.heroSubtitle}>{t('settings.subtitle')}</Text>
        </View>

        <SettingsSection
          title={t('settings.language.title')}
          description={t('settings.language.description')}
        >
          <LanguageSwitcher variant="settings" />
        </SettingsSection>

        <SettingsSection
          title={t('settings.theme.title')}
          description={t('settings.theme.description')}
        >
          <ThemePreferencePicker />
        </SettingsSection>

        <SettingsSection
          title={t('settings.notifications.title')}
          description={t('settings.notifications.description')}
        >
          <NotificationSettingsRow />
        </SettingsSection>

        <Text style={styles.version}>
          {t('settings.version', { version: APP_VERSION })}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    hero: {
      alignItems: 'center',
      paddingBottom: spacing.sm,
      gap: spacing.xs,
    },
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroSubtitle: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 280,
    },
    version: {
      ...typography.caption,
      color: c.textSubtle,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
