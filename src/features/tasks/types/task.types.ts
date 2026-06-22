export type TaskStatus = 'pending' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskTag = 'work' | 'personal' | 'study';

export type TaskDisplayStatus = 'pending' | 'completed' | 'overdue';

export type TaskHistoryType = 'created' | 'updated' | 'completed' | 'reopened';

export interface TaskHistoryEntry {
  id: string;
  type: TaskHistoryType;
  timestamp: string;
  fields?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: TaskTag[];
  createdAt: string;
  history: TaskHistoryEntry[];
}

export interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface DummyJsonTodosResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}
