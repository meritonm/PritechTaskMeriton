import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { format, isBefore, parseISO, startOfDay, subDays } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import {
  Task,
  TaskDisplayStatus,
  TaskHistoryEntry,
  TaskHistoryType,
  TaskStatus,
} from '@/features/tasks/types/task.types';

function historyEntry(type: TaskHistoryType, fields?: string[]): TaskHistoryEntry {
  return {
    id: Crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    ...(fields && fields.length > 0 ? { fields } : {}),
  };
}

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  statusFilter: 'all' | TaskStatus | 'overdue';

  addTask: (input: TaskFormValues) => Task;
  updateTask: (id: string, input: Partial<TaskFormValues>) => void;
  toggleTaskStatus: (id: string) => void;
  setTaskDisplayStatus: (id: string, status: TaskDisplayStatus) => void;
  deleteTask: (id: string) => void;
  importTasks: (tasks: Task[]) => void;
  setTasks: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | TaskStatus | 'overdue') => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      searchQuery: '',
      statusFilter: 'all',

      addTask: (input) => {
        const task: Task = {
          id: Crypto.randomUUID(),
          title: input.title.trim(),
          description: input.description?.trim() ?? '',
          status: 'pending',
          priority: input.priority,
          dueDate: input.dueDate ?? null,
          reminderEnabled: input.reminderEnabled ?? false,
          reminderTime: input.reminderEnabled ? (input.reminderTime ?? '09:00') : null,
          tags: input.tags ?? [],
          createdAt: new Date().toISOString(),
          history: [historyEntry('created')],
        };

        set((state) => ({
          tasks: [task, ...state.tasks],
        }));

        return task;
      },

      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) {
              return task;
            }

            const changedFields: string[] = [];
            const next = { ...task };

            if (input.title !== undefined && input.title.trim() !== task.title) {
              next.title = input.title.trim();
              changedFields.push('title');
            }
            if (input.description !== undefined && input.description.trim() !== task.description) {
              next.description = input.description.trim();
              changedFields.push('description');
            }
            if (input.priority !== undefined && input.priority !== task.priority) {
              next.priority = input.priority;
              changedFields.push('priority');
            }
            if (input.dueDate !== undefined && input.dueDate !== task.dueDate) {
              next.dueDate = input.dueDate;
              changedFields.push('dueDate');
            }
            if (
              input.reminderEnabled !== undefined &&
              input.reminderEnabled !== task.reminderEnabled
            ) {
              next.reminderEnabled = input.reminderEnabled;
              changedFields.push('reminderEnabled');
            }
            if (input.reminderTime !== undefined && input.reminderTime !== task.reminderTime) {
              next.reminderTime = input.reminderTime;
              changedFields.push('reminderTime');
            }
            if (input.tags !== undefined && !arraysEqual(input.tags, task.tags)) {
              next.tags = input.tags;
              changedFields.push('tags');
            }

            if (changedFields.length === 0) {
              return task;
            }

            next.history = [historyEntry('updated', changedFields), ...task.history];
            return next;
          }),
        })),

      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) {
              return task;
            }
            const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
            return {
              ...task,
              status: nextStatus,
              history: [
                historyEntry(nextStatus === 'completed' ? 'completed' : 'reopened'),
                ...task.history,
              ],
            };
          }),
        })),

      setTaskDisplayStatus: (id, target) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) {
              return task;
            }

            const current = getTaskDisplayStatus(task);
            if (current === target) {
              return task;
            }

            const today = format(new Date(), 'yyyy-MM-dd');
            const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

            if (target === 'completed') {
              return {
                ...task,
                status: 'completed',
                history: [historyEntry('completed'), ...task.history],
              };
            }

            if (target === 'pending') {
              const next = { ...task, status: 'pending' as const };
              if (
                task.dueDate &&
                isBefore(startOfDay(parseISO(task.dueDate)), startOfDay(new Date()))
              ) {
                next.dueDate = today;
              }
              return {
                ...next,
                history: [
                  historyEntry(task.status === 'completed' ? 'reopened' : 'updated', ['status']),
                  ...task.history,
                ],
              };
            }

            // overdue
            const next = { ...task, status: 'pending' as const };
            if (
              !task.dueDate ||
              !isBefore(startOfDay(parseISO(task.dueDate)), startOfDay(new Date()))
            ) {
              next.dueDate = yesterday;
            }
            return {
              ...next,
              history: [historyEntry('updated', ['dueDate']), ...task.history],
            };
          }),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      importTasks: (tasks) =>
        set((state) => ({
          tasks: [...tasks, ...state.tasks],
        })),

      setTasks: (tasks) => set({ tasks }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
    }),
    {
      name: 'tasks-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const state = persisted as { tasks?: Task[] } | undefined;
        if (state?.tasks) {
          state.tasks = state.tasks.map((task) => ({
            ...task,
            history: task.history ?? [historyEntry('created')],
            reminderEnabled: task.reminderEnabled ?? false,
            reminderTime: task.reminderTime ?? null,
          }));
        }
        return state as never;
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('Failed to restore tasks from storage', error);
        }
      },
    },
  ),
);

export function getFilteredTasks(state: Pick<TaskStore, 'tasks' | 'searchQuery' | 'statusFilter'>) {
  const query = state.searchQuery.trim().toLowerCase();

  return state.tasks.filter((task) => {
    const displayStatus = getTaskDisplayStatus(task);
    const matchesSearch =
      query.length === 0 ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some((tag) => tag.includes(query));

    const matchesStatus =
      state.statusFilter === 'all' ||
      (state.statusFilter === 'overdue'
        ? displayStatus === 'overdue'
        : displayStatus === state.statusFilter);

    return matchesSearch && matchesStatus;
  });
}
