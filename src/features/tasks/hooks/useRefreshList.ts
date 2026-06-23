import { useCallback, useState } from 'react';

/**
 * Lightweight pull-to-refresh for the local task list.
 * Tasks live in AsyncStorage — no API refetch (that stays on "Import sample tasks").
 */
export function useRefreshList() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return { refreshing, onRefresh };
}
