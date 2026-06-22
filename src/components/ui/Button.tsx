import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { radius, shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

function getLabelColor(variant: ButtonVariant, c: ThemeColors): string {
  switch (variant) {
    case 'secondary':
      return c.text;
    case 'ghost':
      return c.primary;
    default:
      return '#FFFFFF';
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const scale = useMemo(() => new Animated.Value(1), []);
  const isInteractive = !disabled && !loading;
  const labelColor = getLabelColor(variant, colors);

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, variant === 'primary' && shadows.sm, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        disabled={!isInteractive}
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          pressed && styles.pressed,
          !isInteractive && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="small" color={labelColor} />
          ) : (
            <>
              {icon ? <Ionicons name={icon} size={18} color={labelColor} /> : null}
              <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    primary: {
      backgroundColor: c.primary,
    },
    secondary: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    danger: {
      backgroundColor: c.danger,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
    label: {
      ...typography.label,
      fontWeight: '600',
    },
  });
