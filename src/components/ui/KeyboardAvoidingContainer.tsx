import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

interface KeyboardAvoidingContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Defaults to navigation header height (0 on screens without a header). */
  keyboardVerticalOffset?: number;
}

export function KeyboardAvoidingContainer({
  children,
  style,
  keyboardVerticalOffset,
}: KeyboardAvoidingContainerProps) {
  const headerHeight = useHeaderHeight();
  const offset = keyboardVerticalOffset ?? headerHeight;

  return (
    <View style={[styles.flex, style]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offset}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
