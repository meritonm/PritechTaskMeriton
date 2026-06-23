import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettingsStore } from '@/features/settings/store/settingsStore';
import { AppLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const LANGUAGE_ICONS: Record<AppLanguage, keyof typeof Ionicons.glyphMap> = {
  en: 'globe-outline',
  sq: 'language-outline',
};

interface LanguageSwitcherProps {
  compact?: boolean;
  variant?: 'compact' | 'settings';
}

export function LanguageSwitcher({ compact = false, variant = 'compact' }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const isSettings = variant === 'settings';
  const styles = useThemedStyles((c) => createStyles(c, compact && !isSettings));

  if (isSettings) {
    return (
      <View>
        {SUPPORTED_LANGUAGES.map((code, index) => {
          const selected = language === code;
          const isLast = index === SUPPORTED_LANGUAGES.length - 1;

          return (
            <Pressable
              key={code}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => {
                haptics.light();
                setLanguage(code);
              }}
              style={({ pressed }) => [
                styles.settingsRow,
                !isLast && styles.settingsRowBorder,
                pressed && styles.settingsRowPressed,
              ]}
            >
              <View style={[styles.settingsIcon, selected && styles.settingsIconSelected]}>
                <Ionicons
                  name={LANGUAGE_ICONS[code]}
                  size={18}
                  color={selected ? colors.primary : colors.textMuted}
                />
              </View>
              <Text style={[styles.settingsLabel, selected && styles.settingsLabelSelected]}>
                {t(`settings.language.${code}`)}
              </Text>
              {selected ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : (
                <View style={styles.radioEmpty} />
              )}
            </Pressable>
          );
        })}
      </View>
    );
  }

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
              {code.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors, compact: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: c.surfaceMuted,
      borderRadius: radius.pill,
      padding: compact ? 2 : 3,
      gap: compact ? 1 : 2,
    },
    segment: {
      paddingHorizontal: compact ? spacing.sm : spacing.md,
      paddingVertical: compact ? 4 : 6,
      borderRadius: radius.pill,
      minWidth: compact ? 32 : 40,
      alignItems: 'center',
    },
    segmentSelected: {
      backgroundColor: c.surface,
    },
    label: {
      ...typography.caption,
      fontSize: compact ? 11 : 13,
      fontWeight: '700',
      color: c.textMuted,
      letterSpacing: 0.5,
    },
    labelSelected: {
      color: c.primary,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 2,
      minHeight: 56,
    },
    settingsRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    settingsRowPressed: {
      backgroundColor: c.surfaceMuted,
    },
    settingsIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceMuted,
    },
    settingsIconSelected: {
      backgroundColor: `${c.primary}14`,
    },
    settingsLabel: {
      ...typography.body,
      color: c.text,
      flex: 1,
      fontWeight: '500',
    },
    settingsLabelSelected: {
      color: c.primary,
      fontWeight: '700',
    },
    radioEmpty: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: c.border,
    },
  });
