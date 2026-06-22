import { useTaskStore } from '@/features/tasks/store/taskStore';

export function useTaskFilters() {
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const statusFilter = useTaskStore((state) => state.statusFilter);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);

  return {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
  };
}
