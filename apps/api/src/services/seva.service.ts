import { prisma } from '../db/prisma';
import { CreateSevaInput, JoinSevaInput } from '@seva/contracts';

export class SevaService {
  async createSeva(userId: string, input: CreateSevaInput) {
    const seva = await prisma.sevaOpportunity.create({
      data: {
        createdBy: userId,
        needId: input.needId,
        organizationId: input.organizationId,
        title: input.title,
        purpose: input.purpose,
        description: input.description,
        category: input.category || 'general',
        isTech: input.isTech,
        requiredContributions: input.requiredContributions as any,
        potentialLearning: input.potentialLearning || [],
        resourcesNeeded: input.resourcesNeeded || [],
        capacity: input.capacity,
        safetyInfo: input.safetyInfo,
        empowermentNote: input.empowermentNote,
        status: 'open',
        events: {
          create: input.events.map(e => ({
            startsAt: new Date(e.startsAt),
            endsAt: e.endsAt ? new Date(e.endsAt) : null,
            placeLabel: e.placeLabel,
            addressPrivate: e.addressPrivate,
            lat: e.lat,
            lng: e.lng,
            mode: e.mode || 'in_person'
          }))
        }
      },
      include: { events: true }
    });

    // Auto-create Seva Circle for participants to collaborate
    const circle = await prisma.sevaCircle.create({
      data: {
        name: `${input.title} - Circle`,
        purpose: input.purpose,
        originOpportunityId: seva.id,
        createdBy: userId,
        members: {
          create: { userId }
        }
      }
    });

    // Add creator as participant
    await prisma.participant.create({
      data: {
        opportunityId: seva.id,
        userId,
        stance: 'both',
        contactConsent: true,
        status: 'joined'
      }
    });

    return { seva, circle };
  }

  async getSevaOpportunities(filters?: { category?: string; status?: string; isTech?: boolean }) {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.isTech !== undefined) where.isTech = filters.isTech;

    const list = await prisma.sevaOpportunity.findMany({
      where,
      include: {
        creator: {
          select: { id: true, profile: { select: { displayName: true, areaLabel: true } } }
        },
        organization: { select: { id: true, name: true, verified: true } },
        events: true,
        participants: { select: { userId: true, stance: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Hide private address for non-joined users
    return list.map(item => ({
      ...item,
      events: item.events.map(ev => ({
        id: ev.id,
        startsAt: ev.startsAt,
        endsAt: ev.endsAt,
        placeLabel: ev.placeLabel,
        mode: ev.mode
      }))
    }));
  }

  async getSevaById(id: string, currentUserId?: string) {
    const seva = await prisma.sevaOpportunity.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, profile: { select: { displayName: true, areaLabel: true } } }
        },
        organization: true,
        events: true,
        participants: {
          include: {
            user: {
              select: { id: true, profile: { select: { displayName: true, areaLabel: true } } }
            }
          }
        },
        circles: { select: { id: true, name: true } }
      }
    });

    if (!seva) {
      const err: any = new Error('Seva opportunity not found.');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const isParticipant = currentUserId
      ? seva.participants.some(p => p.userId === currentUserId && p.contactConsent)
      : false;

    // Show private address only to joined participants who gave consent
    return {
      ...seva,
      events: seva.events.map(ev => ({
        ...ev,
        addressPrivate: isParticipant ? ev.addressPrivate : undefined
      }))
    };
  }

  async joinSeva(id: string, userId: string, input: JoinSevaInput) {
    const seva = await prisma.sevaOpportunity.findUnique({
      where: { id },
      include: { circles: true }
    });

    if (!seva) {
      const err: any = new Error('Seva opportunity not found.');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const participant = await prisma.participant.upsert({
      where: {
        opportunityId_userId: { opportunityId: id, userId }
      },
      update: {
        stance: input.stance || 'both',
        contributingAs: input.contributingAs,
        contactConsent: input.shareContact,
        status: 'joined'
      },
      create: {
        opportunityId: id,
        userId,
        stance: input.stance || 'both',
        contributingAs: input.contributingAs,
        contactConsent: input.shareContact,
        status: 'joined'
      }
    });

    // Add participant to the associated Seva Circle
    const circle = seva.circles[0];
    if (circle) {
      await prisma.circleMember.upsert({
        where: {
          circleId_userId: { circleId: circle.id, userId }
        },
        update: {},
        create: { circleId: circle.id, userId }
      });
    }

    return { participant, circleId: circle?.id };
  }
}
