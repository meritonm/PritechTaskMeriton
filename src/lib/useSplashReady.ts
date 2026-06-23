import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useSettingsStore } from '@/features/settings/store/settingsStore';

const MIN_SPLASH_MS = 1600;

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function waitForSettingsHydration(): Promise<void> {
  if (useSettingsStore.persist.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Hides the native splash quickly, keeps the custom in-app splash visible
 * until settings hydrate + minimum display time.
 */
export function useSplashReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      await wait(80);
      await SplashScreen.hideAsync();

      await Promise.all([waitForSettingsHydration(), wait(MIN_SPLASH_MS)]);

      if (!cancelled) {
        setReady(true);
      }
    }

    void prepare();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
