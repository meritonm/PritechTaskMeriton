import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore } from '@/lib/toastStore';
import { radius, shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const ICONS = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
} as const satisfies Record<string, keyof typeof Ionicons.glyphMap>;

export function Toast() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { visible, message, type, hide } = useToastStore();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 220,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateY, opacity]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrapper,
        { top: insets.top + spacing.sm, opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable onPress={hide} style={styles.toast} accessibilityRole="alert">
        <Animated.View
          style={[
            styles.iconWrap,
            {
              backgroundColor: `${type === 'success' ? colors.success : type === 'error' ? colors.danger : colors.primary}22`,
            },
          ]}
        >
          <Ionicons
            name={ICONS[type]}
            size={22}
            color={type === 'success' ? colors.success : type === 'error' ? colors.danger : colors.primary}
          />
        </Animated.View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 9999,
      elevation: 20,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      ...shadows.lg,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      ...typography.body,
      color: c.text,
      flex: 1,
      fontWeight: '600',
    },
  });
