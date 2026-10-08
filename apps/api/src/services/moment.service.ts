import { prisma } from '../db/prisma';
import { CreateMomentInput, CreateReflectionInput } from '@seva/contracts';
import { encryptText, decryptText } from '../utils/crypto.util';

export class MomentService {
  async createMoment(userId: string, input: CreateMomentInput) {
    const moment = await prisma.sevaMoment.create({
      data: {
        userId,
        opportunityId: input.opportunityId,
        contributed: input.contributed,
        learned: input.learned,
        taughtByOthers: input.taughtByOthers,
        visibility: input.visibility || 'private',
        isSilent: input.isSilent || false,
        occurredOn: new Date(input.occurredOn)
      }
    });

    return moment;
  }

  async createReflection(userId: string, input: CreateReflectionInput) {
    // Encrypt reflection body text before DB insert
    const bodyEncrypted = encryptText(input.body);

    const reflection = await prisma.reflection.create({
      data: {
        momentId: input.momentId,
        userId,
        sankalpId: input.sankalpId,
        surprise: input.surprise,
        expectationMatch: input.expectationMatch,
        doDifferently: input.doDifferently,
        bodyEncrypted
      }
    });

    return {
      id: reflection.id,
      momentId: reflection.momentId,
      createdAt: reflection.createdAt
    };
  }

  async getUserMomentsAndReflections(userId: string) {
    const moments = await prisma.sevaMoment.findMany({
      where: { userId },
      include: {
        reflections: true
      },
      orderBy: { occurredOn: 'desc' }
    });

    // Decrypt reflections for the owner only
    return moments.map(m => ({
      ...m,
      reflections: m.reflections.map(r => ({
        id: r.id,
        surprise: r.surprise,
        expectationMatch: r.expectationMatch,
        doDifferently: r.doDifferently,
        body: decryptText(r.bodyEncrypted),
        createdAt: r.createdAt
      }))
    }));
  }
}
