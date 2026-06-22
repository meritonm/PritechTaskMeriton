import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useTaskStore } from '@/features/tasks/store/taskStore';
import { radius, spacing, ThemeColors, typography, useThemedStyles } from '@/theme';

export function TaskProgress() {
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);
  const tasks = useTaskStore((state) => state.tasks);

  const { done, total, ratio } = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const count = tasks.length;
    return { done: completed, total: count, ratio: count === 0 ? 0 : completed / count };
  }, [tasks]);

  const width = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.timing(width, {
      toValue: ratio,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [ratio, width]);

  if (total === 0) {
    return null;
  }

  const percent = Math.round(ratio * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.label}>{t('list.progress', { done, total })}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: width.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
      paddingTop: spacing.xs,
    },
    labels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '600',
    },
    percent: {
      ...typography.caption,
      color: c.success,
      fontWeight: '700',
    },
    track: {
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceMuted,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.pill,
      backgroundColor: c.success,
    },
  });
