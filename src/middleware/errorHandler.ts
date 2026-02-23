import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { validateEnv } from '../config/env';

const env = validateEnv();

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  // Don't expose internal errors in production
  const message =
    env.NODE_ENV === 'production' ? 'Internal server error' : error.message;

  sendError(res, 500, message);
};
