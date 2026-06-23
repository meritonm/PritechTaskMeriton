import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { TaskListHeader } from '@/features/tasks/components/TaskListHeader';
import { ImportSampleButton } from '@/features/tasks/components/ImportSampleButton';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskCardSkeleton } from '@/features/tasks/components/TaskCardSkeleton';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { TaskListSortBar } from '@/features/tasks/components/TaskListSortBar';
import { TaskProgress } from '@/features/tasks/components/TaskProgress';
import { TaskSearchBar } from '@/features/tasks/components/TaskSearchBar';
import { useImportSampleTasks } from '@/features/tasks/hooks/useImportSampleTasks';
import { useRefreshList } from '@/features/tasks/hooks/useRefreshList';
import { getFilteredTasks, useTaskStore } from '@/features/tasks/store/taskStore';
import { Task } from '@/features/tasks/types/task.types';
import { groupTasksByDate, sortTasks, TaskSection } from '@/features/tasks/utils/taskListUtils';
import { shadows, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

const SKELETON_KEYS = ['s1', 's2', 's3', 's4'];

function ListSeparator() {
  return <View style={separatorStyles.gap} />;
}

const separatorStyles = StyleSheet.create({
  gap: {
    height: spacing.md,
  },
});

export default function TaskListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const tasks = useTaskStore((state) => state.tasks);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const statusFilter = useTaskStore((state) => state.statusFilter);
  const sortBy = useTaskStore((state) => state.sortBy);
  const groupByDate = useTaskStore((state) => state.groupByDate);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const filteredTasks = getFilteredTasks({ tasks, searchQuery, statusFilter });
  const sortedTasks = useMemo(() => sortTasks(filteredTasks, sortBy), [filteredTasks, sortBy]);
  const sections = useMemo(
    () =>
      groupByDate
        ? groupTasksByDate(sortedTasks, t)
        : [{ key: 'all', title: '', data: sortedTasks }],
    [groupByDate, sortedTasks, t],
  );
  const { isImporting } = useImportSampleTasks();
  const { refreshing, onRefresh } = useRefreshList();
  const canReorder =
    sortBy === 'manual' && !groupByDate && statusFilter === 'all' && searchQuery.trim() === '';

  const fabOpacity = useRef(new Animated.Value(1)).current;
  const fabTranslateY = useRef(new Animated.Value(0)).current;
  const fabVisible = useRef(true);
  const [fabInteractive, setFabInteractive] = useState(true);

  const hasTasks = tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;
  const showSkeleton = isImporting && !hasTasks;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const shouldShow = y < 48;
    if (shouldShow === fabVisible.current) {
      return;
    }
    fabVisible.current = shouldShow;
    setFabInteractive(shouldShow);
    Animated.parallel([
      Animated.timing(fabOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fabTranslateY, {
        toValue: shouldShow ? 0 : 24,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <TaskCard task={item} onDrag={canReorder ? drag : undefined} dragging={isActive} />
    </ScaleDecorator>
  );

  const renderTaskItem = (item: Task) => <TaskCard task={item} />;

  const renderSectionHeader = ({ section }: { section: TaskSection }) => {
    if (!section.title) {
      return null;
    }
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  const listProps = {
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled' as const,
    keyboardDismissMode: Platform.OS === 'ios' ? ('interactive' as const) : ('on-drag' as const),
    onScrollBeginDrag: Keyboard.dismiss,
    onScroll: handleScroll,
    scrollEventThrottle: 16,
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors.primary}
        colors={[colors.primary]}
      />
    ),
  };

  const renderBody = () => {
    if (showSkeleton) {
      return (
        <View style={styles.skeletonList}>
          {SKELETON_KEYS.map((key) => (
            <TaskCardSkeleton key={key} />
          ))}
        </View>
      );
    }

    if (!hasTasks) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            title={t('list.emptyTitle')}
            description={t('list.emptyDescription')}
            hint={t('list.emptyHint')}
            actionLabel={t('list.emptyAction')}
            onAction={() => router.push('/task/create')}
          />
          <View style={styles.importWrap}>
            <ImportSampleButton />
          </View>
        </View>
      );
    }

    if (!hasFilteredTasks) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            title={t('list.noMatchTitle')}
            description={t('list.noMatchDescription')}
            actionLabel={t('list.clearFilters')}
            actionIcon="close-circle-outline"
            onAction={clearFilters}
          />
        </View>
      );
    }

    if (canReorder) {
      return (
        <DraggableFlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderDraggableItem}
          onDragEnd={({ data }) => setTasks(data)}
          activationDistance={12}
          containerStyle={styles.listFill}
          style={styles.listFill}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          {...listProps}
        />
      );
    }

    return (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTaskItem(item)}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={ListSeparator}
        SectionSeparatorComponent={ListSeparator}
        contentContainerStyle={styles.listContent}
        style={styles.listFill}
        {...listProps}
      />
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.flex}>
          <TaskListHeader taskCount={tasks.length} showImport={hasTasks} />

          {hasTasks ? (
            <View style={styles.listControls}>
              <TaskProgress />
              <TaskSearchBar />
              <TaskFilters />
              <TaskListSortBar />
            </View>
          ) : null}

          <View style={styles.listContainer}>{renderBody()}</View>

          <Animated.View
            pointerEvents={fabInteractive ? 'auto' : 'none'}
            style={[
              styles.fabWrap,
              { opacity: fabOpacity, transform: [{ translateY: fabTranslateY }] },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/task/create')}
              style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    listControls: {
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    listContainer: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },
    listFill: {
      ...StyleSheet.absoluteFillObject,
    },
    listContent: {
      paddingTop: spacing.xs,
      paddingBottom: 96,
    },
    sectionHeader: {
      ...typography.caption,
      color: c.textMuted,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
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
    fabWrap: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.xl,
    },
    fab: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.lg,
    },
    fabPressed: {
      backgroundColor: c.primaryDark,
      transform: [{ scale: 0.96 }],
    },
  });
