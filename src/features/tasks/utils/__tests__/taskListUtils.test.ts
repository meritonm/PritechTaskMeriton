import { addDays, formatISO, subDays } from 'date-fns';

import { Task } from '@/features/tasks/types/task.types';
import { groupTasksByDate, sortTasks } from '@/features/tasks/utils/taskListUtils';

const isoDate = (date: Date) => formatISO(date, { representation: 'date' });

const baseTask = (overrides: Partial<Task>): Task => ({
  id: Math.random().toString(),
  title: 'Task',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: null,
  reminderEnabled: false,
  reminderTime: null,
  tags: [],
  createdAt: new Date().toISOString(),
  history: [],
  ...overrides,
});

const t = (key: string) => key;

describe('sortTasks', () => {
  it('returns manual order unchanged', () => {
    const tasks = [baseTask({ title: 'A' }), baseTask({ title: 'B' })];
    expect(sortTasks(tasks, 'manual')).toEqual(tasks);
  });

  it('sorts by due date with nulls last', () => {
    const tasks = [
      baseTask({ title: 'Later', dueDate: isoDate(addDays(new Date(), 5)) }),
      baseTask({ title: 'No date' }),
      baseTask({ title: 'Soon', dueDate: isoDate(addDays(new Date(), 1)) }),
    ];
    const sorted = sortTasks(tasks, 'dueDate');
    expect(sorted.map((task) => task.title)).toEqual(['Soon', 'Later', 'No date']);
  });

  it('sorts by priority high first', () => {
    const tasks = [
      baseTask({ priority: 'low' }),
      baseTask({ priority: 'high' }),
      baseTask({ priority: 'medium' }),
    ];
    const sorted = sortTasks(tasks, 'priority');
    expect(sorted.map((task) => task.priority)).toEqual(['high', 'medium', 'low']);
  });
});

describe('groupTasksByDate', () => {
  it('groups tasks into today, tomorrow, later, and no date', () => {
    const tasks = [
      baseTask({ title: 'Today', dueDate: isoDate(new Date()) }),
      baseTask({ title: 'Tomorrow', dueDate: isoDate(addDays(new Date(), 1)) }),
      baseTask({ title: 'Later', dueDate: isoDate(addDays(new Date(), 3)) }),
      baseTask({ title: 'Past', dueDate: isoDate(subDays(new Date(), 2)) }),
      baseTask({ title: 'No date' }),
    ];

    const sections = groupTasksByDate(tasks, t as never);
    expect(sections.map((section) => section.key)).toEqual(['today', 'tomorrow', 'later', 'noDate']);
    expect(sections[2].data.map((task) => task.title)).toContain('Past');
    expect(sections[3].data[0].title).toBe('No date');
  });
});
