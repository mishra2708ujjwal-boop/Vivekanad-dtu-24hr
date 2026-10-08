import { z } from 'zod';

export const CreateMomentSchema = z.object({
  opportunityId: z.string().uuid().optional(),
  contributed: z.string().min(2),
  learned: z.string().min(2),
  taughtByOthers: z.string().optional(),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  visibility: z.enum(['private', 'circle']).default('private'),
  isSilent: z.boolean().default(false),
});

export const CreateReflectionSchema = z.object({
  momentId: z.string().uuid(),
  sankalpId: z.string().uuid().optional(),
  surprise: z.string().optional(),
  expectationMatch: z.string().optional(),
  doDifferently: z.string().optional(),
  body: z.string().min(5, 'Reflection text is required.'),
});

export type CreateMomentInput = z.infer<typeof CreateMomentSchema>;
export type CreateReflectionInput = z.infer<typeof CreateReflectionSchema>;
