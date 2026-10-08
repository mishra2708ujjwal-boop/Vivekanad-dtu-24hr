import { Router } from 'express';
import { ProfileService } from '../services/profile.service';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { ProfileUpdateSchema, UserSkillsUpdateSchema, SankalpSchema } from '@seva/contracts';

const router = Router();
const profileService = new ProfileService();

router.get('/profile', authenticateJwt, async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user!.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', authenticateJwt, validateBody(ProfileUpdateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const updated = await profileService.updateProfile(req.user!.userId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.put('/profile/skills', authenticateJwt, validateBody(UserSkillsUpdateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const updated = await profileService.updateUserSkills(req.user!.userId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/sankalp', authenticateJwt, validateBody(SankalpSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const sankalp = await profileService.setSankalp(req.user!.userId, req.body);
    res.status(201).json(sankalp);
  } catch (err) {
    next(err);
  }
});

router.get('/skills', authenticateJwt, async (req, res, next) => {
  try {
    const catalog = await profileService.getSkillsCatalog();
    res.json(catalog);
  } catch (err) {
    next(err);
  }
});

export default router;
