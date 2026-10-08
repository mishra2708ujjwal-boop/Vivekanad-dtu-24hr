import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fields[path] = err.message;
        });

        return res.status(400).json({
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Please check the highlighted fields.',
            fields,
            requestId: req.headers['x-request-id'] || 'req-val-failed'
          }
        });
      }
      next(error);
    }
  };
}
