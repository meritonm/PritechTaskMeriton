import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettingsStore } from '@/features/settings/store/settingsStore';
import { AppLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import { radius, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'EN',
  sq: 'SQ',
};

export function LanguageSwitcher() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {SUPPORTED_LANGUAGES.map((code) => {
        const selected = language === code;
        return (
          <Pressable
            key={code}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setLanguage(code)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {LANGUAGE_LABELS[code]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: c.surfaceMuted,
      borderRadius: radius.pill,
      padding: 3,
      gap: 2,
    },
    segment: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.pill,
      minWidth: 40,
      alignItems: 'center',
    },
    segmentSelected: {
      backgroundColor: c.surface,
    },
    label: {
      ...typography.caption,
      fontWeight: '700',
      color: c.textMuted,
      letterSpacing: 0.5,
    },
    labelSelected: {
      color: c.primary,
    },
  });
