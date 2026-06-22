import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { colors, radius, spacing, typography } from '@/theme';

export function TaskSearchBar() {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useTaskFilters();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Ionicons name="search" size={18} color={focused ? colors.primary : colors.textSubtle} />
      <TextInput
        placeholder={t('list.searchPlaceholder')}
        placeholderTextColor={colors.textSubtle}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
});
