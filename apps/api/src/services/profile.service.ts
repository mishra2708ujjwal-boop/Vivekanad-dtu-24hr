import { prisma } from '../db/prisma';
import { ProfileUpdateInput, UserSkillsUpdateInput, SankalpInput } from '@seva/contracts';

export class ProfileService {
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            systemRole: true,
            createdAt: true,
            userSkills: {
              include: { skill: true }
            },
            sankalps: {
              where: { active: true }
            }
          }
        }
      }
    });

    if (!profile) {
      const err: any = new Error('Profile not found.');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const contributeSkills = profile.user.userSkills
      .filter(s => s.kind === 'contribute')
      .map(s => ({ skillId: s.skillId, name: s.skill.name, category: s.skill.category, level: s.level }));

    const learnSkills = profile.user.userSkills
      .filter(s => s.kind === 'learn')
      .map(s => ({ skillId: s.skillId, name: s.skill.name, category: s.skill.category, level: s.level }));

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      bio: profile.bio,
      areaLabel: profile.areaLabel,
      lat: profile.lat,
      lng: profile.lng,
      languages: profile.languages,
      availability: profile.availability,
      visibility: profile.visibility,
      onboardingDone: profile.onboardingDone,
      activeSankalp: profile.user.sankalps[0] || null,
      contribute: contributeSkills,
      learn: learnSkills
    };
  }

  async updateProfile(userId: string, input: ProfileUpdateInput) {
    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        ...input,
        onboardingDone: true
      }
    });
    return updated;
  }

  async updateUserSkills(userId: string, input: UserSkillsUpdateInput) {
    // Delete existing skills for user
    await prisma.userSkill.deleteMany({ where: { userId } });

    const createData: Array<{ userId: string; skillId: number; kind: string; level?: string }> = [];

    input.contribute.forEach(s => {
      createData.push({ userId, skillId: s.skillId, kind: 'contribute', level: s.level || 'practiced' });
    });

    input.learn.forEach(s => {
      createData.push({ userId, skillId: s.skillId, kind: 'learn', level: s.level || 'beginner' });
    });

    if (createData.length > 0) {
      await prisma.userSkill.createMany({ data: createData });
    }

    return this.getProfile(userId);
  }

  async setSankalp(userId: string, input: SankalpInput) {
    // Deactivate previous active sankalps
    await prisma.sankalp.updateMany({
      where: { userId, active: true },
      data: { active: false }
    });

    // Create new active sankalp
    const sankalp = await prisma.sankalp.create({
      data: {
        userId,
        intention: input.intention,
        note: input.note,
        active: true
      }
    });

    return sankalp;
  }

  async getSkillsCatalog() {
    return prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
  }
}
