import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import i18n from '@/i18n';
import { Task } from '@/features/tasks/types/task.types';

const CHANNEL_ID = 'task-reminders';
const REMINDER_HOUR = 9;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permissionRequested = false;

async function ensurePermissions(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return true;
    }
    if (permissionRequested) {
      return false;
    }
    permissionRequested = true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  } catch {
    // Channel setup is best-effort.
  }
}

function reminderDate(dueDate: string): Date | null {
  const date = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(REMINDER_HOUR, 0, 0, 0);
  if (date.getTime() <= Date.now()) {
    return null;
  }
  return date;
}

export async function scheduleTaskReminder(task: Task): Promise<void> {
  if (!task.dueDate || task.status === 'completed') {
    return;
  }
  const date = reminderDate(task.dueDate);
  if (!date) {
    return;
  }
  if (!(await ensurePermissions())) {
    return;
  }
  await ensureAndroidChannel();
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: task.id,
      content: {
        title: task.title,
        body: i18n.t('notifications.reminderBody'),
        data: { taskId: task.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    // Scheduling is best-effort (e.g. unsupported in Expo Go).
  }
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
  } catch {
    // Ignore: nothing scheduled or unsupported environment.
  }
}

export async function rescheduleTaskReminder(task: Task): Promise<void> {
  await cancelTaskReminder(task.id);
  await scheduleTaskReminder(task);
}
