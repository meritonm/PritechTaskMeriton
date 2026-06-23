import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function NotificationDeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    function openTaskFromNotification(response: Notifications.NotificationResponse) {
      const taskId = response.notification.request.content.data?.taskId;
      if (typeof taskId === 'string' && taskId.length > 0) {
        router.push(`/task/${taskId}`);
      }
    }

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        openTaskFromNotification(response);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      openTaskFromNotification,
    );

    return () => subscription.remove();
  }, [router]);

  return null;
}
