export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  priority: { low: string; medium: string; high: string };
  tag: { work: string; personal: string; study: string };
}

export const lightColors: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  text: '#0F172A',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
  border: '#E2E8F0',
  success: '#16A34A',
  successLight: '#DCFCE7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#EA580C',
  warningLight: '#FFEDD5',
  priority: {
    low: '#64748B',
    medium: '#2563EB',
    high: '#DC2626',
  },
  tag: {
    work: '#7C3AED',
    personal: '#0891B2',
    study: '#CA8A04',
  },
};

export const darkColors: ThemeColors = {
  background: '#0B1120',
  surface: '#1E293B',
  surfaceMuted: '#273449',
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#1E3A5F',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textSubtle: '#64748B',
  border: '#334155',
  success: '#4ADE80',
  successLight: '#143524',
  danger: '#F87171',
  dangerLight: '#3B1D1D',
  warning: '#FB923C',
  warningLight: '#3A2613',
  priority: {
    low: '#94A3B8',
    medium: '#60A5FA',
    high: '#F87171',
  },
  tag: {
    work: '#A78BFA',
    personal: '#22D3EE',
    study: '#FACC15',
  },
};

/** Default (light) palette. Prefer `useColors()` for theme-aware values. */
export const colors = lightColors;
