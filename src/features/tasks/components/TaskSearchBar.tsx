import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { radius, spacing, ThemeColors, typography, useColors, useThemedStyles } from '@/theme';

export function TaskSearchBar() {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useTaskFilters();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Ionicons name="search" size={18} color={focused ? colors.primary : colors.textSubtle} />
      <TextInput
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
        placeholder={t('list.searchPlaceholder')}
        placeholderTextColor={colors.textSubtle}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={Keyboard.dismiss}
        blurOnSubmit
        style={styles.input}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      height: 48,
    },
    containerFocused: {
      borderColor: c.primary,
    },
    input: {
      flex: 1,
      ...typography.body,
      color: c.text,
      padding: 0,
    },
  });
