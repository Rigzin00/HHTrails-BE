import { Request, Response, NextFunction } from 'express';
import { AppError, ServiceUnavailableError } from '../utils/errors';
import { sendError } from '../utils/response';
import { validateEnv } from '../config/env';

const env = validateEnv();

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.log('🔴 ERROR HANDLER WAS CALLED');
  console.log('Error type:', error.constructor.name);
  console.log('Error message:', error.message);
  console.log('Is AppError?', error instanceof AppError);
  
  // Check for network/timeout errors FIRST (even if wrapped in AppError)
  const errorMessage = (error.message || '').toLowerCase();
  const errorName = (error.name || '').toLowerCase();
  const errorCode = (error as any).code || '';
  const causeCode = (error as any).cause?.code || '';
  
  // Detect timeout errors specifically
  const isTimeout = 
    causeCode === 'UND_ERR_CONNECT_TIMEOUT' ||
    errorCode === 'UND_ERR_CONNECT_TIMEOUT' ||
    errorCode === 'ETIMEDOUT' ||
    causeCode === 'ETIMEDOUT' ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out');

  // Detect network errors
  const isNetworkError = 
    errorMessage.includes('fetch failed') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('econnrefused') ||
    errorMessage.includes('enotfound') ||
    errorMessage.includes('connection') ||
    errorName === 'fetcherror' ||
    errorName === 'typeerror' ||
    errorCode.includes('ECONNREFUSED') ||
    errorCode.includes('ENOTFOUND') ||
    causeCode.includes('ECONNREFUSED') ||
    causeCode.includes('ENOTFOUND');

  // Handle timeout errors FIRST
  if (isTimeout) {
    console.log('✓ Detected as TIMEOUT error');
    const timeoutError = new ServiceUnavailableError(
      'Connection timed out. Please check your internet connection and try again.'
    );
    sendError(res, timeoutError.statusCode, timeoutError.message);
    return;
  }

  // Handle network errors SECOND
  if (isNetworkError) {
    console.log('✓ Detected as NETWORK/FETCH error');
    const networkError = new ServiceUnavailableError(
      'Unable to connect to the service. Please check your internet connection and try again.'
    );
    sendError(res, networkError.statusCode, networkError.message);
    return;
  }

  // THEN check if it's a handled AppError
  if (error instanceof AppError) {
    console.log('✓ Error is AppError type (after network checks)');
    sendError(res, error.statusCode, error.message);
    return;
  }

  // Log unexpected errors for debugging
  console.error('================================');
  console.error('UNEXPECTED ERROR (not caught by checks above):');
  console.error('Message:', error.message);
  console.error('Name:', error.name);
  console.error('Code:', (error as any).code);
  console.error('Cause:', (error as any).cause);
  console.error('================================');

  // Don't expose internal errors in production
  const message =
    env.NODE_ENV === 'production' ? 'Internal server error' : error.message;

  sendError(res, 500, message);
};
