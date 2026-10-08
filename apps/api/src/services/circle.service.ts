import { prisma } from '../db/prisma';

export class CircleService {
  async getUserCircles(userId: string) {
    const memberships = await prisma.circleMember.findMany({
      where: { userId },
      include: {
        circle: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, profile: { select: { displayName: true } } }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    return memberships.map(m => m.circle);
  }

  async getCircleDetails(circleId: string, userId: string) {
    const member = await prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId } }
    });

    if (!member) {
      const err: any = new Error('You are not a member of this Seva circle.');
      err.status = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }

    return prisma.sevaCircle.findUnique({
      where: { id: circleId },
      include: {
        members: {
          include: {
            user: { select: { id: true, profile: { select: { displayName: true } } } }
          }
        }
      }
    });
  }

  async getCircleMessages(circleId: string, userId: string) {
    await this.getCircleDetails(circleId, userId); // verify membership

    return prisma.message.findMany({
      where: { circleId },
      include: {
        sender: { select: { id: true, profile: { select: { displayName: true } } } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async sendMessage(circleId: string, senderId: string, body: string, kind = 'message') {
    await this.getCircleDetails(circleId, senderId);

    return prisma.message.create({
      data: {
        circleId,
        senderId,
        body,
        kind
      },
      include: {
        sender: { select: { id: true, profile: { select: { displayName: true } } } }
      }
    });
  }
}
