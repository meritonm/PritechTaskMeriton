import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { fetchSampleTodos } from '@/features/tasks/api/tasksApi';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { mapApiTodoToTask } from '@/features/tasks/utils/mapApiTodoToTask';
import { haptics } from '@/lib/haptics';

export function useImportSampleTasks() {
  const { t } = useTranslation();
  const importTasks = useTaskStore((state) => state.importTasks);

  const mutation = useMutation({
    mutationFn: fetchSampleTodos,
    onSuccess: (data) => {
      const mapped = data.todos.map((todo, index) => mapApiTodoToTask(todo, index));
      importTasks(mapped);
      haptics.success();
      Alert.alert(t('alerts.importedTitle'), t('alerts.importedMessage', { count: mapped.length }));
    },
    onError: () => {
      haptics.warning();
      Alert.alert(t('alerts.importFailedTitle'), t('alerts.importFailedMessage'));
    },
  });

  return {
    runImport: () => mutation.mutate(),
    isImporting: mutation.isPending,
  };
}
