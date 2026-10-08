import { Router } from 'express';
import { NeedService } from '../services/need.service';
import { GroqAIService } from '../services/groq-ai.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { StructureNeedInputSchema, CreateNeedSchema } from '@seva/contracts';

const router = Router();
const needService = new NeedService();
const aiService = new GroqAIService();

// AI Need Structuring endpoint (Groq LLM)
router.post('/needs/structure', authenticateJwt, validateBody(StructureNeedInputSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const structuredDraft = await aiService.structureNeed(req.body.rawText);
    res.json(structuredDraft);
  } catch (err) {
    next(err);
  }
});

// Publish Need
router.post('/needs', authenticateJwt, validateBody(CreateNeedSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const need = await needService.createNeed(req.user!.userId, req.body);
    res.status(201).json(need);
  } catch (err) {
    next(err);
  }
});

// Browse Needs
router.get('/needs', async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const needs = await needService.getNeeds({
      category: category as string,
      status: status as string
    });
    res.json(needs);
  } catch (err) {
    next(err);
  }
});

// Need Detail
router.get('/needs/:id', async (req, res, next) => {
  try {
    const need = await needService.getNeedById(req.params.id);
    res.json(need);
  } catch (err) {
    next(err);
  }
});

export default router;
