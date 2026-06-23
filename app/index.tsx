import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
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
import { TaskProgress } from '@/features/tasks/components/TaskProgress';
import { TaskSearchBar } from '@/features/tasks/components/TaskSearchBar';
import { useImportSampleTasks } from '@/features/tasks/hooks/useImportSampleTasks';
import { useRefreshList } from '@/features/tasks/hooks/useRefreshList';
import { getFilteredTasks, useTaskStore } from '@/features/tasks/store/taskStore';
import { Task } from '@/features/tasks/types/task.types';
import { shadows, spacing, ThemeColors, useColors, useThemedStyles } from '@/theme';

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
  const setTasks = useTaskStore((state) => state.setTasks);
  const filteredTasks = getFilteredTasks({ tasks, searchQuery, statusFilter });
  const { isImporting } = useImportSampleTasks();
  const { refreshing, onRefresh } = useRefreshList();
  const canReorder = statusFilter === 'all' && searchQuery.trim() === '';

  const hasTasks = tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;
  const showSkeleton = isImporting && !hasTasks;

  const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <TaskCard task={item} onDrag={canReorder ? drag : undefined} dragging={isActive} />
    </ScaleDecorator>
  );

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
          <EmptyState title={t('list.noMatchTitle')} description={t('list.noMatchDescription')} />
        </View>
      );
    }

    return (
      <DraggableFlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderDraggableItem}
        onDragEnd={({ data }) => setTasks(data)}
        activationDistance={canReorder ? 12 : 10000}
        containerStyle={styles.listFill}
        style={styles.listFill}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        onScrollBeginDrag={Keyboard.dismiss}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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
            </View>
          ) : null}

          <View style={styles.listContainer}>
            {renderBody()}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/task/create')}
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </Pressable>
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
