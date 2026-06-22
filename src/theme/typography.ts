import { TextStyle } from 'react-native';

export const typography = {
  title: { fontSize: 20, fontWeight: '600' } satisfies TextStyle,
  subtitle: { fontSize: 17, fontWeight: '600' } satisfies TextStyle,
  body: { fontSize: 16, fontWeight: '400' } satisfies TextStyle,
  caption: { fontSize: 13, fontWeight: '400' } satisfies TextStyle,
  label: { fontSize: 14, fontWeight: '500' } satisfies TextStyle,
} as const;
