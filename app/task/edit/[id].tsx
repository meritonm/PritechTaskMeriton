import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ErrorView } from '@/components/ui/ErrorView';
import { Screen } from '@/components/ui/Screen';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { rescheduleTaskReminder } from '@/lib/notifications';

export default function EditTaskScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const updateTask = useTaskStore((state) => state.updateTask);

  if (!task) {
    return (
      <Screen>
        <ErrorView
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundMessage')}
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }

  const handleSubmit = (values: TaskFormValues) => {
    updateTask(task.id, values);
    const updated = useTaskStore.getState().tasks.find((item) => item.id === task.id);
    if (updated) {
      void rescheduleTaskReminder(updated);
    }
    router.back();
  };

  return (
    <Screen>
      <TaskForm
        mode="edit"
        defaultValues={{
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          tags: task.tags,
        }}
        onSubmit={handleSubmit}
      />
    </Screen>
  );
}
