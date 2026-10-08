import { z } from 'zod';

export const MirrorInsightSchema = z.object({
  id: z.string().uuid().optional(),
  observations: z.array(z.object({
    text: z.string(),
    evidence: z.array(z.object({
      reflectionId: z.string(),
      excerpt: z.string(),
    })),
  })),
  question: z.string(),
});

export type MirrorInsight = z.infer<typeof MirrorInsightSchema>;
