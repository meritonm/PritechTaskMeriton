import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const { visible, message, type, action, hide } = useToastStore();
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

  const accent =
    type === 'success' ? colors.success : type === 'error' ? colors.danger : colors.primary;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrapper,
        { top: insets.top + spacing.sm, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toast}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
          <Ionicons name={ICONS[type]} size={22} color={accent} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        {action ? (
          <Pressable
            onPress={() => {
              action.onPress();
              hide();
            }}
            hitSlop={8}
            accessibilityRole="button"
            style={styles.actionButton}
          >
            <Text style={[styles.actionLabel, { color: accent }]}>{action.label}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={hide} hitSlop={8} accessibilityRole="button">
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
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
    actionButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    actionLabel: {
      ...typography.body,
      fontWeight: '700',
    },
  });
