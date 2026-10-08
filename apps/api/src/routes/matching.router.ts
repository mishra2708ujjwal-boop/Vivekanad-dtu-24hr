import { Router } from 'express';
import { MatchingService } from '../services/matching.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const matchingService = new MatchingService();

router.get('/recommendations', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const recommendations = await matchingService.getRecommendationsForUser(req.user!.userId);
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

export default router;
