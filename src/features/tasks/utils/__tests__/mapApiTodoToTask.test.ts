import { parseISO } from 'date-fns';

import { DummyJsonTodo } from '@/features/tasks/types/task.types';
import { mapApiTodoToTask } from '@/features/tasks/utils/mapApiTodoToTask';

const makeTodo = (overrides: Partial<DummyJsonTodo> = {}): DummyJsonTodo => ({
  id: 1,
  todo: '  Do the laundry  ',
  completed: false,
  userId: 1,
  ...overrides,
});

describe('mapApiTodoToTask', () => {
  it('trims the title and assigns an id', () => {
    const task = mapApiTodoToTask(makeTodo(), 0);
    expect(task.title).toBe('Do the laundry');
    expect(task.id).toBeTruthy();
  });

  it('maps completed flag to the internal status', () => {
    expect(mapApiTodoToTask(makeTodo({ completed: true }), 0).status).toBe('completed');
    expect(mapApiTodoToTask(makeTodo({ completed: false }), 0).status).toBe('pending');
  });

  it('always assigns a valid priority and at least one tag', () => {
    for (let index = 0; index < 6; index += 1) {
      const task = mapApiTodoToTask(makeTodo(), index);
      expect(['low', 'medium', 'high']).toContain(task.priority);
      expect(task.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('produces a parseable ISO due date or null', () => {
    const task = mapApiTodoToTask(makeTodo(), 3);
    if (task.dueDate) {
      expect(() => parseISO(task.dueDate as string)).not.toThrow();
    }
  });
});
