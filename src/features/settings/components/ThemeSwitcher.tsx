import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { radius, ThemeColors, useColors, useTheme, useThemedStyles } from '@/theme';
import { haptics } from '@/lib/haptics';

interface ThemeSwitcherProps {
  compact?: boolean;
}

export function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { scheme, toggle } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles((c) => createStyles(c, compact));
  const isDark = scheme === 'dark';
  const iconSize = compact ? 16 : 18;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Toggle dark mode"
      hitSlop={8}
      onPress={() => {
        haptics.light();
        toggle();
      }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={iconSize} color={colors.primary} />
    </Pressable>
  );
}

const createStyles = (c: ThemeColors, compact: boolean) =>
  StyleSheet.create({
    button: {
      width: compact ? 34 : 40,
      height: compact ? 34 : 40,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.7,
    },
  });
