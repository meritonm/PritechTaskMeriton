import { useRouter } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskFormValues } from '@/features/tasks/schemas/task.schema';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import { haptics } from '@/lib/haptics';

export default function CreateTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (values: TaskFormValues) => {
    addTask(values);
    haptics.success();
    router.back();
  };

  return (
    <Screen>
      <TaskForm mode="create" onSubmit={handleSubmit} />
    </Screen>
  );
}
