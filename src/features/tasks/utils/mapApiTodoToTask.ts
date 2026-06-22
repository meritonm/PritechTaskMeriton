import { addDays, formatISO, subDays } from 'date-fns';
import * as Crypto from 'expo-crypto';

import { TASK_PRIORITIES, TASK_TAGS } from '@/features/tasks/schemas/task.schema';
import { DummyJsonTodo, Task, TaskPriority, TaskTag } from '@/features/tasks/types/task.types';

const SAMPLE_DESCRIPTIONS = [
  'Review and finalize before the deadline.',
  'Block time on your calendar to focus on this.',
  'Coordinate with the team if needed.',
  'Break this into smaller subtasks.',
  '',
];

function pickPriority(index: number): TaskPriority {
  return TASK_PRIORITIES[index % TASK_PRIORITIES.length];
}

function pickTags(index: number): TaskTag[] {
  const primary = TASK_TAGS[index % TASK_TAGS.length];
  if (index % 4 === 0) {
    return [primary, TASK_TAGS[(index + 1) % TASK_TAGS.length]];
  }
  return [primary];
}

function pickDueDate(index: number, completed: boolean): string | null {
  if (completed) {
    return formatISO(subDays(new Date(), index % 5), { representation: 'date' });
  }

  if (index % 5 === 0) {
    return formatISO(subDays(new Date(), 1 + (index % 3)), { representation: 'date' });
  }

  return formatISO(addDays(new Date(), 1 + (index % 14)), { representation: 'date' });
}

export function mapApiTodoToTask(todo: DummyJsonTodo, index: number): Task {
  return {
    id: Crypto.randomUUID(),
    title: todo.todo.trim(),
    description: SAMPLE_DESCRIPTIONS[index % SAMPLE_DESCRIPTIONS.length],
    status: todo.completed ? 'completed' : 'pending',
    priority: pickPriority(index),
    dueDate: pickDueDate(index, todo.completed),
    tags: pickTags(index),
    createdAt: new Date().toISOString(),
  };
}
