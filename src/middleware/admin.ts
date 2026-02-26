import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errors';
import { validateEnv } from '../config/env';

const env = validateEnv();

/**
 * Middleware to verify admin access using secret key
 * Frontend should send: Authorization: Bearer <ADMIN_SECRET_KEY>
 * Or: x-admin-key: <ADMIN_SECRET_KEY>
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    const adminKeyHeader = req.headers['x-admin-key'] as string;

    let providedKey: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      providedKey = authHeader.substring(7);
    } else if (adminKeyHeader) {
      providedKey = adminKeyHeader;
    }

    if (!providedKey) {
      throw new AuthorizationError('Admin authentication required. Please provide admin key.');
    }

    if (providedKey !== env.ADMIN_SECRET_KEY) {
      throw new AuthorizationError('Invalid admin credentials');
    }

    // Admin verified, continue
    next();
  } catch (error) {
    next(error);
  }
};
