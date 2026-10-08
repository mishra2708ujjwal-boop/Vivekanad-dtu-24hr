import { Router } from 'express';
import { ModerationService } from '../services/moderation.service';
import { authenticateJwt, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { CreateReportSchema } from '@seva/contracts';

const router = Router();
const moderationService = new ModerationService();

router.post('/reports', authenticateJwt, validateBody(CreateReportSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const report = await moderationService.createReport(req.user!.userId, req.body);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/admin/reports', authenticateJwt, requireRole(['admin', 'moderator']), async (req: AuthenticatedRequest, res, next) => {
  try {
    const queue = await moderationService.getReportsQueue();
    res.json(queue);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/reports/:id', authenticateJwt, requireRole(['admin', 'moderator']), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { status } = req.body;
    const updated = await moderationService.updateReportStatus(req.params.id, req.user!.userId, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
