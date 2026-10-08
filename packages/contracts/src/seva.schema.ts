import { z } from 'zod';

export const CreateSevaSchema = z.object({
  title: z.string().min(3),
  purpose: z.string().min(5),
  description: z.string().optional(),
  needId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  category: z.string().optional(),
  isTech: z.boolean().default(false),
  requiredContributions: z.array(z.object({
    skillId: z.number().optional(),
    count: z.number().int().positive(),
    description: z.string().optional(),
  })),
  potentialLearning: z.array(z.string()).optional(),
  resourcesNeeded: z.array(z.string()).optional(),
  capacity: z.number().int().positive().optional(),
  safetyInfo: z.string().optional(),
  empowermentNote: z.string().min(5, 'Empowerment note is required to ensure community self-reliance.'),
  events: z.array(z.object({
    startsAt: z.string(),
    endsAt: z.string().optional(),
    placeLabel: z.string().optional(),
    addressPrivate: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    mode: z.enum(['in_person', 'online', 'hybrid']).default('in_person'),
  })),
});

export const JoinSevaSchema = z.object({
  contributingAs: z.string().optional(),
  stance: z.enum(['contributing', 'learning', 'both']).default('both'),
  shareContact: z.boolean().default(false),
});

export type CreateSevaInput = z.infer<typeof CreateSevaSchema>;
export type JoinSevaInput = z.infer<typeof JoinSevaSchema>;
