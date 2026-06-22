import { DummyJsonTodosResponse } from '@/features/tasks/types/task.types';

const DUMMY_JSON_TODOS_URL = 'https://dummyjson.com/todos?limit=12';

export async function fetchSampleTodos(): Promise<DummyJsonTodosResponse> {
  const response = await fetch(DUMMY_JSON_TODOS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (${response.status})`);
  }

  return response.json() as Promise<DummyJsonTodosResponse>;
}
