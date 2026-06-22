import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { radius, ThemeColors, useColors, useTheme, useThemedStyles } from '@/theme';
import { haptics } from '@/lib/haptics';

export function ThemeSwitcher() {
  const { scheme, toggle } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const isDark = scheme === 'dark';

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
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.primary} />
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.7,
    },
  });
