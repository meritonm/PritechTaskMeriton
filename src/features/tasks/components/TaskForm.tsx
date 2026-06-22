import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { TextField } from '@/components/ui/TextField';
import { PriorityPicker } from '@/features/tasks/components/PriorityPicker';
import { TagPicker } from '@/features/tasks/components/TagPicker';
import { TaskFormValues, taskFormSchema } from '@/features/tasks/schemas/task.schema';
import { spacing } from '@/theme';

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  mode: 'create' | 'edit';
  onSubmit: (values: TaskFormValues) => void;
}

export function TaskForm({ defaultValues, mode, onSubmit }: TaskFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
      tags: [],
      ...defaultValues,
    },
  });

  const translateError = (message?: string) => (message ? t(message) : undefined);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={`${t('form.titleLabel')} *`}
            placeholder={t('form.titlePlaceholder')}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={translateError(errors.title?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('form.descriptionLabel')}
            placeholder={t('form.descriptionPlaceholder')}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            error={translateError(errors.description?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <PriorityPicker value={value} onChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <DatePickerField label={t('form.dueDateLabel')} value={value} onChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="tags"
        render={({ field: { onChange, value } }) => <TagPicker value={value} onChange={onChange} />}
      />

      <View style={styles.footer}>
        <Button
          label={mode === 'create' ? t('form.createSubmit') : t('form.saveSubmit')}
          icon={mode === 'create' ? 'add-circle-outline' : 'checkmark-circle-outline'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: spacing.sm,
  },
});
