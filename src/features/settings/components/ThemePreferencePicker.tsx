import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { ThemePreference } from '@/theme/colors';
import { spacing, ThemeColors, typography, useColors, useTheme, useThemedStyles } from '@/theme';

const OPTIONS: {
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'system', icon: 'phone-portrait-outline' },
  { value: 'light', icon: 'sunny-outline' },
  { value: 'dark', icon: 'moon-outline' },
];

export function ThemePreferencePicker() {
  const { t } = useTranslation();
  const colors = useColors();
  const { preference, setPreference } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {OPTIONS.map((option, index) => {
        const selected = preference === option.value;
        const isLast = index === OPTIONS.length - 1;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => {
              haptics.light();
              setPreference(option.value);
            }}
            style={({ pressed }) => [
              styles.row,
              !isLast && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
              <Ionicons
                name={option.icon}
                size={18}
                color={selected ? colors.primary : colors.textMuted}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {t(`settings.theme.${option.value}`)}
              </Text>
              <Text style={styles.hint}>{t(`settings.theme.${option.value}Hint`)}</Text>
            </View>
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

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 2,
      minHeight: 64,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    rowPressed: {
      backgroundColor: c.surfaceMuted,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceMuted,
    },
    iconWrapSelected: {
      backgroundColor: `${c.primary}14`,
    },
    textWrap: {
      flex: 1,
      gap: 2,
    },
    label: {
      ...typography.body,
      color: c.text,
      fontWeight: '500',
    },
    labelSelected: {
      color: c.primary,
      fontWeight: '700',
    },
    hint: {
      ...typography.caption,
      color: c.textSubtle,
    },
    radioEmpty: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: c.border,
    },
  });
