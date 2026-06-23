import { Alert } from 'react-native';
import { TFunction } from 'i18next';

import {
  openNotificationSettings,
  ScheduleReminderResult,
} from '@/lib/notifications';

export function showReminderErrorAlert(result: ScheduleReminderResult, t: TFunction): void {
  if (result.ok) {
    return;
  }

  if (result.reason === 'past') {
    Alert.alert(t('notifications.pastTitle'), t('notifications.pastMessage'));
    return;
  }

  if (result.reason === 'permission') {
    Alert.alert(t('notifications.permissionTitle'), t('notifications.permissionDeniedSettings'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('notifications.openSettings'), onPress: openNotificationSettings },
    ]);
  }
}
