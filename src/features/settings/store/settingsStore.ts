import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { AppLanguage } from '@/i18n';
import { ThemePreference } from '@/theme/colors';

interface SettingsStore {
  language: AppLanguage;
  themePreference: ThemePreference;
  setLanguage: (language: AppLanguage) => void;
  setThemePreference: (preference: ThemePreference) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: (i18n.language as AppLanguage) ?? 'en',
      themePreference: 'system',

      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setThemePreference: (preference) => set({ themePreference: preference }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to restore settings from storage', error);
          return;
        }
        if (state?.language && state.language !== i18n.language) {
          i18n.changeLanguage(state.language);
        }
      },
    },
  ),
);
