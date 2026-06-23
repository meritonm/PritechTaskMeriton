import { Switch, SwitchProps } from 'react-native';

import { useColors, useTheme } from '@/theme';

type AppSwitchProps = Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'>;

export function AppSwitch({ value, ...props }: AppSwitchProps) {
  const colors = useColors();
  const { scheme } = useTheme();
  const isDark = scheme === 'dark';

  return (
    <Switch
      {...props}
      value={value}
      trackColor={{
        false: isDark ? '#475569' : colors.border,
        true: isDark ? colors.primary : colors.primary,
      }}
      thumbColor={value ? '#FFFFFF' : isDark ? '#E2E8F0' : '#FFFFFF'}
      ios_backgroundColor={isDark ? '#475569' : colors.border}
    />
  );
}
