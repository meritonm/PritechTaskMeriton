import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { getTaskDisplayStatus } from '@/features/tasks/utils/taskStatus';
import { Task, TaskStatus } from '@/features/tasks/types/task.types';

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  statusFilter: 'all' | TaskStatus | 'overdue';

  addTask: (input: TaskFormValues) => void;
  updateTask: (id: string, input: Partial<TaskFormValues>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  importTasks: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | TaskStatus | 'overdue') => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      searchQuery: '',
      statusFilter: 'all',

      addTask: (input) =>
        set((state) => ({
          tasks: [
            {
              id: Crypto.randomUUID(),
              title: input.title.trim(),
              description: input.description?.trim() ?? '',
              status: 'pending',
              priority: input.priority,
              dueDate: input.dueDate ?? null,
              tags: input.tags ?? [],
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),

      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...(input.title !== undefined ? { title: input.title.trim() } : {}),
                  ...(input.description !== undefined
                    ? { description: input.description.trim() }
                    : {}),
                  ...(input.priority !== undefined ? { priority: input.priority } : {}),
                  ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
                  ...(input.tags !== undefined ? { tags: input.tags } : {}),
                }
              : task,
          ),
        })),

      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === 'completed' ? 'pending' : 'completed',
                }
              : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      importTasks: (tasks) =>
        set((state) => ({
          tasks: [...tasks, ...state.tasks],
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
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
