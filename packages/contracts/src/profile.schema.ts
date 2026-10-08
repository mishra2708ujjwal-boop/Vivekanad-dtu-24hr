import { z } from 'zod';

export const SkillRefSchema = z.object({
  skillId: z.number().int().positive(),
  level: z.enum(['beginner', 'practiced', 'experienced']).optional(),
});

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().optional(),
  areaLabel: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  languages: z.array(z.string()).optional(),
  availability: z.record(z.boolean()).optional(),
  visibility: z.enum(['private', 'members', 'public']).optional(),
});

export const UserSkillsUpdateSchema = z.object({
  contribute: z.array(SkillRefSchema),
  learn: z.array(SkillRefSchema),
});

export const SankalpSchema = z.object({
  intention: z.string().min(2, 'Intention is required'),
  note: z.string().optional(),
});

export type SkillRef = z.infer<typeof SkillRefSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type UserSkillsUpdateInput = z.infer<typeof UserSkillsUpdateSchema>;
export type SankalpInput = z.infer<typeof SankalpSchema>;
