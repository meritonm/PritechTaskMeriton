import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

function build(
  opacity: number,
  radius: number,
  offsetHeight: number,
  elevation: number,
): ShadowStyle {
  return Platform.select<ShadowStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetHeight },
    },
    android: { elevation },
    default: {},
  }) as ShadowStyle;
}

export const shadows = {
  sm: build(0.05, 6, 2, 2),
  md: build(0.08, 12, 6, 5),
  lg: build(0.12, 20, 10, 10),
} as const;
