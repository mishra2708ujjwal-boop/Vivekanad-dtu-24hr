import { Router, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validateBody } from '../middleware/validate.middleware';
import { SignupSchema, LoginSchema } from '@seva/contracts';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

const router = Router();
const authService = new AuthService();

router.post('/signup', validateBody(SignupSchema), async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validateBody(LoginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Refresh token cookie required.' }
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email, systemRole: payload.systemRole });
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email, systemRole: payload.systemRole });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({
      error: { code: 'TOKEN_EXPIRED', message: 'Invalid or expired refresh token.' }
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.status(204).send();
});

export default router;
