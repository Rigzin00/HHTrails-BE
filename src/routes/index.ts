import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API version routes
router.use('/v1', v1Routes);

export default router;
