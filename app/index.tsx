import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ImportSampleButton } from '@/features/tasks/components/ImportSampleButton';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskCardSkeleton } from '@/features/tasks/components/TaskCardSkeleton';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { TaskSearchBar } from '@/features/tasks/components/TaskSearchBar';
import { useImportSampleTasks } from '@/features/tasks/hooks/useImportSampleTasks';
import { getFilteredTasks, useTaskStore } from '@/features/tasks/store/taskStore';
import { LanguageSwitcher } from '@/features/settings/components/LanguageSwitcher';
import { colors, radius, shadows, spacing, typography } from '@/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SKELETON_KEYS = ['s1', 's2', 's3', 's4'];

export default function TaskListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const statusFilter = useTaskStore((state) => state.statusFilter);
  const filteredTasks = getFilteredTasks({ tasks, searchQuery, statusFilter });
  const { runImport, isImporting } = useImportSampleTasks();

  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) {
      LayoutAnimation.configureNext(LayoutAnimation.create(240, 'easeInEaseOut', 'opacity'));
    } else {
      mountedRef.current = true;
    }
  }, [tasks]);

  const hasTasks = tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;
  const showSkeleton = isImporting && !hasTasks;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>{t('list.title')}</Text>
          </View>
          <LanguageSwitcher />
        </View>
        <View style={styles.headerBottom}>
          <Text style={styles.subtitle}>{t('list.subtitle', { count: tasks.length })}</Text>
          {hasTasks ? <ImportSampleButton compact /> : null}
        </View>
      </View>

      {hasTasks ? (
        <>
          <TaskSearchBar />
          <TaskFilters />
        </>
      ) : null}

      {showSkeleton ? (
        <View style={styles.skeletonList}>
          {SKELETON_KEYS.map((key) => (
            <TaskCardSkeleton key={key} />
          ))}
        </View>
      ) : !hasTasks ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title={t('list.emptyTitle')}
            description={t('list.emptyDescription')}
            actionLabel={t('list.emptyAction')}
            onAction={() => router.push('/task/create')}
          />
          <View style={styles.importWrap}>
            <ImportSampleButton />
          </View>
        </View>
      ) : !hasFilteredTasks ? (
        <View style={styles.emptyWrap}>
          <EmptyState title={t('list.noMatchTitle')} description={t('list.noMatchDescription')} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isImporting}
              onRefresh={runImport}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/task/create')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  list: {
    gap: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 96,
  },
  skeletonList: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  importWrap: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.96 }],
  },
});
