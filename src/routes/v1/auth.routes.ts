import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validate } from '../../middleware/validator';
import { authenticate } from '../../middleware/auth';
import {
  signUpSchema,
  signInSchema,
  googleAuthSchema,
  refreshTokenSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '../../validators/auth.validator';

const router = Router();

// Public routes
router.post('/signup', validate(signUpSchema), AuthController.signUp);
router.post('/signin', validate(signInSchema), AuthController.signIn);
router.post('/google', validate(googleAuthSchema), AuthController.googleAuth);
router.get('/google/url', AuthController.getGoogleAuthUrl);
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/password/reset-request', validate(resetPasswordRequestSchema), AuthController.requestPasswordReset);
router.post('/password/reset', validate(resetPasswordSchema), AuthController.resetPassword);

// Protected routes
router.post('/signout', authenticate, AuthController.signOut);
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
