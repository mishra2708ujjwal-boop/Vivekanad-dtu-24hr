import { prisma } from '../db/prisma';
import { CreateNeedInput } from '@seva/contracts';

export class NeedService {
  async createNeed(userId: string, input: CreateNeedInput) {
    const need = await prisma.communityNeed.create({
      data: {
        postedBy: userId,
        organizationId: input.organizationId,
        rawText: input.rawText,
        title: input.title,
        structured: input.structured as any,
        empowermentNote: input.empowermentNote,
        category: input.category || 'general',
        areaLabel: input.areaLabel,
        lat: input.lat,
        lng: input.lng,
        status: 'open'
      }
    });

    return need;
  }

  async getNeeds(filters?: { category?: string; status?: string }) {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;

    return prisma.communityNeed.findMany({
      where,
      include: {
        poster: {
          select: {
            id: true,
            profile: {
              select: { displayName: true, areaLabel: true }
            }
          }
        },
        organization: {
          select: { id: true, name: true, verified: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getNeedById(id: string) {
    const need = await prisma.communityNeed.findUnique({
      where: { id },
      include: {
        poster: {
          select: {
            id: true,
            profile: { select: { displayName: true, areaLabel: true } }
          }
        },
        organization: true,
        sevaCreated: {
          select: { id: true, title: true, status: true }
        }
      }
    });

    if (!need) {
      const err: any = new Error('Community need not found.');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    return need;
  }
}
