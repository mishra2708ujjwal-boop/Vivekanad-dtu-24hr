import { prisma } from '../db/prisma';
import { Recommendation } from '@seva/contracts';

export class MatchingService {
  async getRecommendationsForUser(userId: string): Promise<Recommendation[]> {
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            userSkills: { include: { skill: true } },
            sankalps: { where: { active: true } },
            circleMemberships: true
          }
        }
      }
    });

    if (!userProfile) return [];

    const contributeSkills = userProfile.user.userSkills
      .filter(s => s.kind === 'contribute')
      .map(s => s.skill.name);

    const learnSkills = userProfile.user.userSkills
      .filter(s => s.kind === 'learn')
      .map(s => s.skill.name);

    const activeSankalp = userProfile.user.sankalps[0]?.intention || '';

    // Fetch open Seva Opportunities
    const sevaList = await prisma.sevaOpportunity.findMany({
      where: { status: 'open', createdBy: { not: userId } },
      include: {
        creator: { select: { profile: { select: { displayName: true } } } }
      }
    });

    const recommendations: Recommendation[] = [];

    for (const seva of sevaList) {
      const reasons: Array<{ code: string; text: string }> = [];

      // R1: Skill Fit
      const reqContributions = (seva.requiredContributions as any[]) || [];
      for (const req of reqContributions) {
        const reqName = req.label || '';
        if (contributeSkills.some(cs => cs.toLowerCase().includes(reqName.toLowerCase()) || reqName.toLowerCase().includes(cs.toLowerCase()))) {
          reasons.push({
            code: 'R1_SKILL_FIT',
            text: `Recommended because you can contribute ${reqName} and this community needs it.`
          });
          break;
        }
      }

      // R2: Learning Fit
      const potLearning = seva.potentialLearning || [];
      for (const learnItem of potLearning) {
        if (learnSkills.some(ls => learnItem.toLowerCase().includes(ls.toLowerCase()))) {
          reasons.push({
            code: 'R2_LEARNING_FIT',
            text: `You said you want to learn ${learnItem}, and this Seva includes it.`
          });
          break;
        }
      }

      // R3: Sankalp Fit
      if (activeSankalp) {
        reasons.push({
          code: 'R3_SANKALP_FIT',
          text: `You are practicing ${activeSankalp}; this Seva provides a low-pressure space to cultivate it.`
        });
      }

      // R4: Nearby
      if (userProfile.areaLabel && seva.title.includes(userProfile.areaLabel)) {
        reasons.push({
          code: 'R4_NEARBY',
          text: `This is in your neighborhood (${userProfile.areaLabel}).`
        });
      }

      // Proximity alone never qualifies - candidate MUST have R1, R2, or R3
      if (reasons.some(r => ['R1_SKILL_FIT', 'R2_LEARNING_FIT', 'R3_SANKALP_FIT'].includes(r.code))) {
        recommendations.push({
          kind: 'seva',
          targetId: seva.id,
          reasons,
          item: {
            id: seva.id,
            title: seva.title,
            purpose: seva.purpose,
            category: seva.category,
            isTech: seva.isTech,
            creatorName: seva.creator?.profile?.displayName || 'Community Member'
          }
        });
      }
    }

    // Cold-start fallback if user has no skills matching yet
    if (recommendations.length === 0 && sevaList.length > 0) {
      const newest = sevaList[0];
      recommendations.push({
        kind: 'seva',
        targetId: newest.id,
        reasons: [{ code: 'COLD_START', text: 'Newly posted near your community.' }],
        item: {
          id: newest.id,
          title: newest.title,
          purpose: newest.purpose,
          category: newest.category,
          isTech: newest.isTech
        }
      });
    }

    return recommendations;
  }
}
