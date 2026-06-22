import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

/**
 * Drives a looping opacity "pulse" used by skeleton placeholders.
 * Encapsulates the imperative start/stop lifecycle so components stay declarative.
 */
export function usePulse({ min = 0.4, max = 1, duration = 700 } = {}) {
  const value = useMemo(() => new Animated.Value(min), [min]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: max, duration, useNativeDriver: true }),
        Animated.timing(value, { toValue: min, duration, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, min, max, duration]);

  return value;
}
