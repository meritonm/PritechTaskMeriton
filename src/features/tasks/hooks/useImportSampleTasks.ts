import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { fetchSampleTodos } from '@/features/tasks/api/tasksApi';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { mapApiTodoToTask } from '@/features/tasks/utils/mapApiTodoToTask';
import { haptics } from '@/lib/haptics';
import { useToastStore } from '@/lib/toastStore';

export function useImportSampleTasks() {
  const { t } = useTranslation();
  const importTasks = useTaskStore((state) => state.importTasks);
  const showToast = useToastStore((state) => state.show);

  const mutation = useMutation({
    mutationFn: fetchSampleTodos,
    onSuccess: (data) => {
      const mapped = data.todos.map((todo, index) => mapApiTodoToTask(todo, index));
      importTasks(mapped);
      haptics.success();
      showToast(t('toast.imported', { count: mapped.length }), 'success');
    },
    onError: () => {
      haptics.warning();
      showToast(t('toast.importFailed'), 'error');
    },
  });

  return {
    runImport: () => mutation.mutate(),
    isImporting: mutation.isPending,
  };
}
