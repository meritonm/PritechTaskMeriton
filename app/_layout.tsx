import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import { AppSplashScreen } from '@/components/ui/AppSplashScreen';
import { AppProviders } from '@/providers/AppProviders';
import { NotificationDeepLinkHandler } from '@/lib/NotificationDeepLinkHandler';
import { useNotificationPrompt } from '@/lib/useNotificationPrompt';
import { useSplashReady } from '@/lib/useSplashReady';
import { typography, useTheme } from '@/theme';

export default function RootLayout() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}

function AppBootstrap() {
  const ready = useSplashReady();
  useNotificationPrompt(ready);

  if (!ready) {
    return <AppSplashScreen />;
  }

  return (
    <>
      <NotificationDeepLinkHandler />
      <ThemedStatusBar />
      <RootStack />
    </>
  );
}

function ThemedStatusBar() {
  const { scheme } = useTheme();
  return <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />;
}

function RootStack() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: typography.subtitle.fontSize },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="task/create" options={{ title: t('headers.newTask') }} />
      <Stack.Screen name="task/[id]" options={{ title: t('headers.taskDetails') }} />
      <Stack.Screen name="task/edit/[id]" options={{ title: t('headers.editTask') }} />
      <Stack.Screen name="settings" options={{ title: t('headers.settings') }} />
    </Stack>
  );
}
