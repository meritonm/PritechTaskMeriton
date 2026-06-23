import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useSettingsStore } from '@/features/settings/store/settingsStore';
import { getNotificationPermissionStatus, requestNotificationPermissions } from '@/lib/notifications';

export function useNotificationPrompt(ready: boolean) {
  const prompted = useSettingsStore((state) => state.notificationsPrompted);
  const setPrompted = useSettingsStore((state) => state.setNotificationsPrompted);
  const { t } = useTranslation();

  useEffect(() => {
    if (!ready || prompted) {
      return;
    }

    let cancelled = false;

    async function prompt() {
      const status = await getNotificationPermissionStatus();
      if (cancelled) {
        return;
      }

      if (status === 'granted' || status !== 'undetermined') {
        setPrompted(true);
        return;
      }

      Alert.alert(
        t('notifications.launchTitle'),
        t('notifications.launchMessage'),
        [
          {
            text: t('notifications.notNow'),
            style: 'cancel',
            onPress: () => setPrompted(true),
          },
          {
            text: t('notifications.allow'),
            onPress: async () => {
              await requestNotificationPermissions();
              setPrompted(true);
            },
          },
        ],
        { cancelable: false },
      );
    }

    const timer = setTimeout(() => void prompt(), 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, prompted, setPrompted, t]);
}
