import { addDays, isSameDay, parseISO, startOfDay } from 'date-fns';
import { TFunction } from 'i18next';

import { Task } from '@/features/tasks/types/task.types';

export type TaskSortBy = 'manual' | 'dueDate' | 'priority' | 'created';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export function sortTasks(tasks: Task[], sortBy: TaskSortBy): Task[] {
  if (sortBy === 'manual') {
    return tasks;
  }

  const copy = [...tasks];

  if (sortBy === 'dueDate') {
    return copy.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }
      if (!a.dueDate) {
        return 1;
      }
      if (!b.dueDate) {
        return -1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  if (sortBy === 'priority') {
    return copy.sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );
  }

  return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface TaskSection {
  key: string;
  title: string;
  data: Task[];
}

export function groupTasksByDate(tasks: Task[], t: TFunction): TaskSection[] {
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(new Date(), 1));

  const buckets: Record<string, Task[]> = {
    today: [],
    tomorrow: [],
    later: [],
    noDate: [],
  };

  for (const task of tasks) {
    if (!task.dueDate) {
      buckets.noDate.push(task);
      continue;
    }

    const due = startOfDay(parseISO(task.dueDate));
    if (isSameDay(due, today)) {
      buckets.today.push(task);
    } else if (isSameDay(due, tomorrow)) {
      buckets.tomorrow.push(task);
    } else {
      buckets.later.push(task);
    }
  }

  const sections: TaskSection[] = [];
  if (buckets.today.length > 0) {
    sections.push({ key: 'today', title: t('groups.today'), data: buckets.today });
  }
  if (buckets.tomorrow.length > 0) {
    sections.push({ key: 'tomorrow', title: t('groups.tomorrow'), data: buckets.tomorrow });
  }
  if (buckets.later.length > 0) {
    sections.push({ key: 'later', title: t('groups.later'), data: buckets.later });
  }
  if (buckets.noDate.length > 0) {
    sections.push({ key: 'noDate', title: t('groups.noDate'), data: buckets.noDate });
  }

  return sections;
}
