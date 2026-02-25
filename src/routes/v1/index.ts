import { Router } from 'express';
import authRoutes from './auth.routes';
import docsRoutes from './docs.routes';
import tourRoutes from './tour.routes';

const router = Router();

// Mount v1 routes
router.use('/auth', authRoutes);
router.use('/docs', docsRoutes);
router.use('/tours', tourRoutes);

export default router;
