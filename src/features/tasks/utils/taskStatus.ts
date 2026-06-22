import { isBefore, parseISO, startOfDay } from 'date-fns';

import { Task, TaskDisplayStatus } from '@/features/tasks/types/task.types';

export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed' || !task.dueDate) {
    return false;
  }

  const due = startOfDay(parseISO(task.dueDate));
  const today = startOfDay(new Date());
  return isBefore(due, today);
}

export function getTaskDisplayStatus(task: Task): TaskDisplayStatus {
  if (task.status === 'completed') {
    return 'completed';
  }

  if (isTaskOverdue(task)) {
    return 'overdue';
  }

  return 'pending';
}

export function getStatusTone(status: TaskDisplayStatus): 'success' | 'danger' | 'warning' {
  if (status === 'completed') return 'success';
  if (status === 'overdue') return 'danger';
  return 'warning';
}
