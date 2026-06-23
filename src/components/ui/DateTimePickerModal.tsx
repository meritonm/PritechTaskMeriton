import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { radius, spacing, ThemeColors, typography, useTheme, useThemedStyles } from '@/theme';

const FADE_MS = 280;
const SLIDE_MS = 320;
const SHEET_OFFSET = 280;

interface DateTimePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
}

export function DateTimePickerModal({
  visible,
  mode,
  value,
  onConfirm,
  onDismiss,
}: DateTimePickerModalProps) {
  const { t } = useTranslation();
  const { scheme, colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [draft, setDraft] = useState(value);
  const [mounted, setMounted] = useState(visible);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(SHEET_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [visible, value]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      fade.setValue(0);
      slide.setValue(SHEET_OFFSET);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: FADE_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: SLIDE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: SHEET_OFFSET,
        duration: SLIDE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, fade, slide]);

  const close = () => {
    onDismiss();
  };

  const confirm = () => {
    onConfirm(draft);
  };

  if (Platform.OS === 'android') {
    if (!visible) {
      return null;
    }
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        themeVariant={scheme}
        onChange={(event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'dismissed') {
            onDismiss();
            return;
          }
          if (event.type === 'set' && date) {
            onConfirm(date);
          }
        }}
      />
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={close}>
      <View style={styles.overlay}>
        <Animated.View
          pointerEvents="none"
          style={[styles.backdrop, { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }) }]}
        />
        <Pressable style={styles.dismissArea} onPress={close} accessibilityRole="button" />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slide }] }]}>
          <View style={styles.toolbar}>
            <Pressable onPress={close} hitSlop={8} accessibilityRole="button">
              <Text style={styles.cancel}>{t('common.cancel')}</Text>
            </Pressable>
            <Pressable onPress={confirm} hitSlop={8} accessibilityRole="button">
              <Text style={styles.done}>{t('common.done')}</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={draft}
            mode={mode}
            display="spinner"
            themeVariant={scheme}
            textColor={colors.text}
            onChange={(_event, date) => {
              if (date) {
                setDraft(date);
              }
            }}
            style={styles.picker}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000',
    },
    dismissArea: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      paddingBottom: spacing.lg,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    cancel: {
      ...typography.body,
      color: c.textMuted,
    },
    done: {
      ...typography.body,
      color: c.primary,
      fontWeight: '700',
    },
    picker: {
      height: 216,
    },
  });
