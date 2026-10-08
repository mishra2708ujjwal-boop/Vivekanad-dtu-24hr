import { Router } from 'express';
import { CircleService } from '../services/circle.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const circleService = new CircleService();

router.get('/circles', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const circles = await circleService.getUserCircles(req.user!.userId);
    res.json(circles);
  } catch (err) {
    next(err);
  }
});

router.get('/circles/:id', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const circle = await circleService.getCircleDetails(req.params.id, req.user!.userId);
    res.json(circle);
  } catch (err) {
    next(err);
  }
});

router.get('/circles/:id/messages', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const messages = await circleService.getCircleMessages(req.params.id, req.user!.userId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post('/circles/:id/messages', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { body, kind } = req.body;
    if (!body || typeof body !== 'string') {
      return res.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'Message body required.' } });
    }

    const message = await circleService.sendMessage(req.params.id, req.user!.userId, body, kind);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

export default router;
