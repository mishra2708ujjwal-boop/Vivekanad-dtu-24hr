import { Router } from 'express';
import { SevaService } from '../services/seva.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { CreateSevaSchema, JoinSevaSchema } from '@seva/contracts';

const router = Router();
const sevaService = new SevaService();

router.post('/seva', authenticateJwt, validateBody(CreateSevaSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await sevaService.createSeva(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/seva', async (req, res, next) => {
  try {
    const { category, status, isTech } = req.query;
    const list = await sevaService.getSevaOpportunities({
      category: category as string,
      status: status as string,
      isTech: isTech === 'true' ? true : isTech === 'false' ? false : undefined
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get('/seva/:id', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let userId: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const payload = require('../utils/jwt.util').verifyAccessToken(authHeader.split(' ')[1]);
        userId = payload.userId;
      } catch (e) {
        // ignore invalid token for public view
      }
    }

    const detail = await sevaService.getSevaById(req.params.id, userId);
    res.json(detail);
  } catch (err) {
    next(err);
  }
});

router.post('/seva/:id/join', authenticateJwt, validateBody(JoinSevaSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await sevaService.joinSeva(req.params.id, req.user!.userId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
