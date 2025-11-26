import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({
          event: LOG_EVENTS.HTTP_ERROR,
          msg: 'Validation error in query parameters',
          data: { errors: error.issues },
          err: error,
        });

        res.status(400).json({
          error: 'Invalid query parameters',
          details: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}

