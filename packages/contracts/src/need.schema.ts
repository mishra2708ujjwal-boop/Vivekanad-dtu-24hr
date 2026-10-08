import { z } from 'zod';

export const StructureNeedInputSchema = z.object({
  rawText: z.string().min(10, 'Please describe the community need in at least 10 words.'),
});

export const RequiredContributionSchema = z.object({
  skillId: z.number().optional(),
  label: z.string(),
  count: z.number().int().positive(),
});

export const CreateNeedSchema = z.object({
  title: z.string().min(3),
  rawText: z.string().min(10),
  organizationId: z.string().uuid().optional(),
  structured: z.object({
    requiredContributions: z.array(RequiredContributionSchema),
    sessions: z.number().int().positive(),
    potentialLearning: z.array(z.string()),
  }),
  empowermentNote: z.string().min(5, 'Explain how this will leave the community self-reliant.'),
  category: z.string().optional(),
  areaLabel: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type StructureNeedInput = z.infer<typeof StructureNeedInputSchema>;
export type RequiredContribution = z.infer<typeof RequiredContributionSchema>;
export type CreateNeedInput = z.infer<typeof CreateNeedSchema>;
