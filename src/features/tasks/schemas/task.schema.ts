import { z } from 'zod';

import { TaskPriority, TaskTag } from '@/features/tasks/types/task.types';

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const satisfies readonly TaskPriority[];

export const TASK_TAGS = ['work', 'personal', 'study'] as const satisfies readonly TaskTag[];

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'validation.titleRequired')
    .max(80, 'validation.titleMax'),
  description: z.string().trim().max(300, 'validation.descriptionMax'),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().nullable(),
  reminderEnabled: z.boolean(),
  reminderTime: z.string().nullable(),
  tags: z.array(z.enum(TASK_TAGS)),
})
  .refine(
    (data) => !data.reminderEnabled || (data.dueDate !== null && data.reminderTime !== null),
    { message: 'validation.reminderNeedsDueDate', path: ['reminderEnabled'] },
  )
  .refine(
    (data) =>
      !data.reminderTime || /^\d{2}:\d{2}$/.test(data.reminderTime),
    { message: 'validation.reminderTimeInvalid', path: ['reminderTime'] },
  );

export type TaskFormValues = z.infer<typeof taskFormSchema>;
