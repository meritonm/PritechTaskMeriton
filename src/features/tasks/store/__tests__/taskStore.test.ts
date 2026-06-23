import { addDays, formatISO, subDays } from 'date-fns';

import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { Task } from '@/features/tasks/types/task.types';
import { getFilteredTasks, useTaskStore } from '@/features/tasks/store/taskStore';

const formTask = (overrides: Partial<TaskFormValues> = {}): TaskFormValues => ({
  title: 'Task',
  description: '',
  priority: 'low' as const,
  dueDate: null,
  reminderEnabled: false,
  reminderTime: null,
  tags: [],
  ...overrides,
});

const isoDate = (date: Date) => formatISO(date, { representation: 'date' });

const resetStore = () =>
  useTaskStore.setState({
    tasks: [],
    searchQuery: '',
    statusFilter: 'all',
    sortBy: 'manual',
    groupByDate: true,
  });

describe('taskStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('adds a task with sensible defaults', () => {
    useTaskStore.getState().addTask(
      formTask({
        title: '  Write tests  ',
        priority: 'high',
      }),
    );

    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Write tests');
    expect(tasks[0].status).toBe('pending');
    expect(tasks[0].priority).toBe('high');
  });

  it('prepends new tasks so the latest is first', () => {
    const { addTask } = useTaskStore.getState();
    addTask(formTask({ title: 'First' }));
    addTask(formTask({ title: 'Second' }));

    expect(useTaskStore.getState().tasks[0].title).toBe('Second');
  });

  it('toggles status between pending and completed', () => {
    useTaskStore.getState().addTask(formTask({ title: 'Toggle me' }));
    const id = useTaskStore.getState().tasks[0].id;

    useTaskStore.getState().toggleTaskStatus(id);
    expect(useTaskStore.getState().tasks[0].status).toBe('completed');

    useTaskStore.getState().toggleTaskStatus(id);
    expect(useTaskStore.getState().tasks[0].status).toBe('pending');
  });

  it('deletes a task by id', () => {
    useTaskStore.getState().addTask(formTask({ title: 'Delete me' }));
    const id = useTaskStore.getState().tasks[0].id;

    useTaskStore.getState().deleteTask(id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('restores a deleted task', () => {
    useTaskStore.getState().addTask(formTask({ title: 'Restore me' }));
    const task = useTaskStore.getState().tasks[0];
    useTaskStore.getState().deleteTask(task.id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);

    useTaskStore.getState().restoreTask(task);
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe('Restore me');
  });

  it('setTaskDisplayStatus marks completed', () => {
    useTaskStore.getState().addTask(formTask({ title: 'Status' }));
    const id = useTaskStore.getState().tasks[0].id;

    useTaskStore.getState().setTaskDisplayStatus(id, 'completed');
    expect(useTaskStore.getState().tasks[0].status).toBe('completed');
  });

  it('setTaskDisplayStatus sets overdue by moving due date to yesterday', () => {
    useTaskStore.getState().addTask(
      formTask({ title: 'Future', dueDate: isoDate(addDays(new Date(), 3)) }),
    );
    const id = useTaskStore.getState().tasks[0].id;

    useTaskStore.getState().setTaskDisplayStatus(id, 'overdue');
    const task = useTaskStore.getState().tasks[0];
    expect(task.status).toBe('pending');
    expect(task.dueDate).toBe(isoDate(subDays(new Date(), 1)));
  });

  it('updates editable fields without touching status', () => {
    useTaskStore.getState().addTask(
      formTask({ title: 'Original', description: 'old' }),
    );
    const id = useTaskStore.getState().tasks[0].id;

    useTaskStore.getState().updateTask(id, { title: 'Updated', priority: 'medium' });
    const task = useTaskStore.getState().tasks[0];
    expect(task.title).toBe('Updated');
    expect(task.priority).toBe('medium');
    expect(task.status).toBe('pending');
  });
});

describe('getFilteredTasks', () => {
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

  const tasks: Task[] = [
    baseTask({ title: 'Buy milk', tags: ['personal'] }),
    baseTask({ title: 'Finish report', status: 'completed' }),
    baseTask({ title: 'Pay bills', dueDate: isoDate(subDays(new Date(), 2)) }),
    baseTask({ title: 'Plan trip', dueDate: isoDate(addDays(new Date(), 5)) }),
  ];

  it('filters by search query in the title', () => {
    const result = getFilteredTasks({ tasks, searchQuery: 'milk', statusFilter: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy milk');
  });

  it('filters by completed status', () => {
    const result = getFilteredTasks({ tasks, searchQuery: '', statusFilter: 'completed' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Finish report');
  });

  it('filters by overdue display status', () => {
    const result = getFilteredTasks({ tasks, searchQuery: '', statusFilter: 'overdue' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Pay bills');
  });

  it('returns everything when filter is all and query is empty', () => {
    const result = getFilteredTasks({ tasks, searchQuery: '', statusFilter: 'all' });
    expect(result).toHaveLength(tasks.length);
  });
});
