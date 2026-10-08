import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('API Error Handler:', err);

  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL';
  const message = err.message || 'An unexpected error occurred. Please try again.';

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId: req.headers['x-request-id'] || 'req-error'
    }
  });
}
