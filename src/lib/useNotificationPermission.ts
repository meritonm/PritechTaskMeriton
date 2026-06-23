import { useCallback, useEffect, useState } from 'react';

import {
  getNotificationPermissionStatus,
  NotificationPermissionStatus,
  requestNotificationPermissions,
} from '@/lib/notifications';

export function useNotificationPermission() {
  const [status, setStatus] = useState<NotificationPermissionStatus>('undetermined');
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const next = await getNotificationPermissionStatus();
    setStatus(next);
    return next;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const request = useCallback(async () => {
    setLoading(true);
    try {
      const result = await requestNotificationPermissions();
      setStatus(result.status);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    status,
    granted: status === 'granted',
    loading,
    refresh,
    request,
  };
}
