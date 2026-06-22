import { addDays, formatISO, subDays } from 'date-fns';

import { Task } from '@/features/tasks/types/task.types';
import {
  getStatusTone,
  getTaskDisplayStatus,
  isTaskOverdue,
} from '@/features/tasks/utils/taskStatus';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Task',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    tags: [],
    createdAt: new Date().toISOString(),
    history: [],
    ...overrides,
  };
}

const isoDate = (date: Date) => formatISO(date, { representation: 'date' });

describe('isTaskOverdue', () => {
  it('returns false when there is no due date', () => {
    expect(isTaskOverdue(makeTask({ dueDate: null }))).toBe(false);
  });

  it('returns false for completed tasks even if past due', () => {
    const task = makeTask({ status: 'completed', dueDate: isoDate(subDays(new Date(), 3)) });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it('returns true when due date is in the past and not completed', () => {
    const task = makeTask({ dueDate: isoDate(subDays(new Date(), 1)) });
    expect(isTaskOverdue(task)).toBe(true);
  });

  it('returns false when due date is in the future', () => {
    const task = makeTask({ dueDate: isoDate(addDays(new Date(), 2)) });
    expect(isTaskOverdue(task)).toBe(false);
  });
});

describe('getTaskDisplayStatus', () => {
  it('prioritizes completed status', () => {
    const task = makeTask({ status: 'completed', dueDate: isoDate(subDays(new Date(), 5)) });
    expect(getTaskDisplayStatus(task)).toBe('completed');
  });

  it('returns overdue for past-due pending tasks', () => {
    expect(getTaskDisplayStatus(makeTask({ dueDate: isoDate(subDays(new Date(), 1)) }))).toBe(
      'overdue',
    );
  });

  it('returns pending otherwise', () => {
    expect(getTaskDisplayStatus(makeTask())).toBe('pending');
  });
});

describe('getStatusTone', () => {
  it('maps display status to the correct tone', () => {
    expect(getStatusTone('completed')).toBe('success');
    expect(getStatusTone('overdue')).toBe('danger');
    expect(getStatusTone('pending')).toBe('warning');
  });
});
