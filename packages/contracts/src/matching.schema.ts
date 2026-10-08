import { z } from 'zod';

export const RecommendationReasonSchema = z.object({
  code: z.string(),
  text: z.string(),
});

export const RecommendationSchema = z.object({
  kind: z.enum(['seva', 'need', 'exchange']),
  targetId: z.string().uuid(),
  reasons: z.array(RecommendationReasonSchema),
  item: z.any().optional(),
});

export type RecommendationReason = z.infer<typeof RecommendationReasonSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
