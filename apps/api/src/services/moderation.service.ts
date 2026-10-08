import { prisma } from '../db/prisma';
import { CreateReportInput } from '@seva/contracts';

export class ModerationService {
  async createReport(reporterId: string, input: CreateReportInput) {
    const report = await prisma.report.create({
      data: {
        reporterId,
        targetType: input.targetType,
        targetId: input.targetId,
        reason: input.reason,
        details: input.details,
        status: 'open'
      }
    });

    return report;
  }

  async getReportsQueue() {
    return prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, profile: { select: { displayName: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateReportStatus(reportId: string, handledBy: string, status: string) {
    return prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        handledBy
      }
    });
  }
}
