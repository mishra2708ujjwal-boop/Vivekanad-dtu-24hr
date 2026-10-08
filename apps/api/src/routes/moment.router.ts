import { Router } from 'express';
import { MomentService } from '../services/moment.service';
import { GroqAIService } from '../services/groq-ai.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { CreateMomentSchema, CreateReflectionSchema } from '@seva/contracts';

const router = Router();
const momentService = new MomentService();
const aiService = new GroqAIService();

router.post('/moments', authenticateJwt, validateBody(CreateMomentSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const moment = await momentService.createMoment(req.user!.userId, req.body);
    res.status(201).json(moment);
  } catch (err) {
    next(err);
  }
});

router.post('/reflections', authenticateJwt, validateBody(CreateReflectionSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const reflection = await momentService.createReflection(req.user!.userId, req.body);
    res.status(201).json(reflection);
  } catch (err) {
    next(err);
  }
});

router.get('/journey', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const journey = await momentService.getUserMomentsAndReflections(req.user!.userId);
    res.json(journey);
  } catch (err) {
    next(err);
  }
});

// AI Mirror endpoint (Groq LLM analysis of reflections)
router.get('/mirror', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const moments = await momentService.getUserMomentsAndReflections(req.user!.userId);
    const reflectionTexts: Array<{ id: string; text: string; occurredOn: string }> = [];

    moments.forEach(m => {
      m.reflections.forEach(r => {
        reflectionTexts.push({
          id: r.id,
          text: r.body,
          occurredOn: m.occurredOn.toISOString()
        });
      });
    });

    const insight = await aiService.generateMirrorInsight(reflectionTexts);
    res.json(insight);
  } catch (err) {
    next(err);
  }
});

export default router;
