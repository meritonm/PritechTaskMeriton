import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { Task } from '@/features/tasks/types/task.types';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { haptics } from '@/lib/haptics';
import { cancelTaskReminder, rescheduleTaskReminder } from '@/lib/notifications';
import { useToastStore } from '@/lib/toastStore';

interface DeleteOptions {
  confirm?: boolean;
  onDeleted?: () => void;
}

export function useDeleteTaskWithUndo() {
  const { t } = useTranslation();
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const restoreTask = useTaskStore((state) => state.restoreTask);
  const showToast = useToastStore((state) => state.show);

  const performDelete = (task: Task, onDeleted?: () => void) => {
    haptics.warning();
    void cancelTaskReminder(task.id);
    deleteTask(task.id);
    showToast(t('toast.taskDeleted', { title: task.title }), {
      type: 'info',
      action: {
        label: t('common.undo'),
        onPress: () => {
          restoreTask(task);
          void rescheduleTaskReminder(task);
        },
      },
    });
    onDeleted?.();
  };

  const deleteWithUndo = (task: Task, options: DeleteOptions = {}) => {
    if (options.confirm) {
      Alert.alert(t('alerts.deleteTitle'), t('alerts.deleteMessage', { title: task.title }), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => performDelete(task, options.onDeleted),
        },
      ]);
      return;
    }

    performDelete(task, options.onDeleted);
  };

  return { deleteWithUndo };
}
