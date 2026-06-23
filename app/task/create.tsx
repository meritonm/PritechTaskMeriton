import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/Screen';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { haptics } from '@/lib/haptics';
import { scheduleTaskReminder } from '@/lib/notifications';
import { showReminderErrorAlert } from '@/lib/showReminderScheduleAlert';
import { useToastStore } from '@/lib/toastStore';

export default function CreateTaskScreen() {
  const router = useRouter();
  const { openDatePicker } = useLocalSearchParams<{ openDatePicker?: string }>();
  const { t } = useTranslation();
  const addTask = useTaskStore((state) => state.addTask);
  const showToast = useToastStore((state) => state.show);

  const handleSubmit = async (values: TaskFormValues) => {
    const created = addTask(values);
    haptics.success();

    if (created.reminderEnabled) {
      const result = await scheduleTaskReminder(created);
      showReminderErrorAlert(result, t);
    }

    router.back();
    showToast(t('toast.taskCreated', { title: created.title }));
  };

  return (
    <Screen>
      <TaskForm
        mode="create"
        onSubmit={handleSubmit}
        autoOpenDueDatePicker={openDatePicker === '1'}
      />
    </Screen>
  );
}
