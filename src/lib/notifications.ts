import * as Notifications from 'expo-notifications';
import { isRunningInExpoGo } from 'expo';
import { format, parseISO } from 'date-fns';
import { Linking, Platform } from 'react-native';

import i18n from '@/i18n';
import { Task } from '@/features/tasks/types/task.types';

const CHANNEL_ID = 'task-reminders';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface NotificationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  status: NotificationPermissionStatus;
}

export type ScheduleReminderResult =
  | { ok: true; fireAt: Date }
  | { ok: false; reason: 'disabled' | 'past' | 'permission' | 'invalid' | 'error' };

export function runsInExpoGo(): boolean {
  return isRunningInExpoGo();
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
    });
  } catch {
    // Channel setup is best-effort.
  }
}

function mapStatus(
  granted: boolean,
  status?: string,
): NotificationPermissionStatus {
  if (granted) {
    return 'granted';
  }
  if (status === 'denied') {
    return 'denied';
  }
  return 'undetermined';
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  try {
    if (Platform.OS === 'android') {
      await ensureAndroidChannel();
    }
    const current = await Notifications.getPermissionsAsync();
    return mapStatus(current.granted, current.status);
  } catch {
    return 'undetermined';
  }
}

/**
 * Requests permission for local scheduled reminders (not remote push).
 * On Android 13+ the notification channel must exist before the OS prompt.
 */
export async function requestNotificationPermissions(): Promise<NotificationPermissionResult> {
  try {
    if (Platform.OS === 'android') {
      await ensureAndroidChannel();
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return {
        granted: true,
        canAskAgain: current.canAskAgain ?? true,
        status: 'granted',
      };
    }

    if (current.status === 'denied' && current.canAskAgain === false) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }

    const requested = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
      },
    });

    return {
      granted: requested.granted,
      canAskAgain: requested.canAskAgain ?? true,
      status: mapStatus(requested.granted, requested.status),
    };
  } catch {
    return { granted: false, canAskAgain: false, status: 'denied' };
  }
}

export function openNotificationSettings(): void {
  void Linking.openSettings();
}

export function getTaskReminderFireAt(task: Task): Date | null {
  if (!task.dueDate || !task.reminderTime) {
    return null;
  }
  return reminderDateTime(task.dueDate, task.reminderTime);
}

function reminderDateTime(dueDate: string, reminderTime: string): Date | null {
  const [hours, minutes] = reminderTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const date = parseISO(dueDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(hours, minutes, 0, 0);
  if (date.getTime() <= Date.now()) {
    return null;
  }

  return date;
}

async function scheduleAt(
  date: Date,
  identifier: string,
  title: string,
  body: string,
  taskId: string,
): Promise<boolean> {
  await ensureAndroidChannel();
  try {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
        data: { taskId, url: `/task/${taskId}` },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function scheduleTaskReminder(task: Task): Promise<ScheduleReminderResult> {
  if (
    !task.dueDate ||
    !task.reminderEnabled ||
    !task.reminderTime ||
    task.status === 'completed'
  ) {
    return { ok: false, reason: 'disabled' };
  }

  const date = reminderDateTime(task.dueDate, task.reminderTime);
  if (!date) {
    return { ok: false, reason: 'past' };
  }

  const { granted } = await requestNotificationPermissions();
  if (!granted) {
    return { ok: false, reason: 'permission' };
  }

  const scheduled = await scheduleAt(
    date,
    task.id,
    task.title,
    i18n.t('notifications.reminderBody', { title: task.title }),
    task.id,
  );

  if (!scheduled) {
    return { ok: false, reason: 'error' };
  }

  return { ok: true, fireAt: date };
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
  } catch {
    // Ignore: nothing scheduled or unsupported environment.
  }
}

export async function rescheduleTaskReminder(task: Task): Promise<ScheduleReminderResult> {
  await cancelTaskReminder(task.id);

  if (!task.reminderEnabled) {
    return { ok: false, reason: 'disabled' };
  }

  return scheduleTaskReminder(task);
}

export function formatReminderSchedule(fireAt: Date): { date: string; time: string } {
  return {
    date: format(fireAt, 'PPP'),
    time: format(fireAt, 'p'),
  };
}
