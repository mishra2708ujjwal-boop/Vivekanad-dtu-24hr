import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication token required.',
        requestId: req.headers['x-request-id'] || 'req-unauth'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Session token has expired or is invalid. Please refresh token.',
        requestId: req.headers['x-request-id'] || 'req-token-expired'
      }
    });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.systemRole)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
          requestId: req.headers['x-request-id'] || 'req-forbidden'
        }
      });
    }
    next();
  };
}
