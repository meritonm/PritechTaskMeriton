import { useQuery } from '@tanstack/react-query';

import { fetchSampleTodos } from '@/features/tasks/api/tasksApi';

export function useSampleTodosQuery() {
  return useQuery({
    queryKey: ['sample-todos'],
    queryFn: fetchSampleTodos,
    staleTime: 5 * 60 * 1000,
  });
}
