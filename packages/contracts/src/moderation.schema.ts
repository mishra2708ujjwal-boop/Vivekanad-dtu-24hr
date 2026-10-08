import { z } from 'zod';

export const CreateReportSchema = z.object({
  targetType: z.enum(['user', 'seva', 'need', 'message', 'circle']),
  targetId: z.string().uuid(),
  reason: z.string().min(3),
  details: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;
