import { ReactNode } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoidingContainer } from '@/components/ui/KeyboardAvoidingContainer';
import { spacing } from '@/theme';

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  /** Extra scroll padding so the last field / submit button clears the keyboard */
  extraBottomPadding?: number;
}

export function KeyboardAwareScrollView({
  children,
  contentContainerStyle,
  style,
  extraBottomPadding = spacing.xxl,
  ...scrollProps
}: KeyboardAwareScrollViewProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + extraBottomPadding + 80;

  return (
    <KeyboardAvoidingContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={[styles.flex, style]}
          contentContainerStyle={[styles.content, { paddingBottom }, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          {...scrollProps}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
