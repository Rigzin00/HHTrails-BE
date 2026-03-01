import { Router } from 'express';
import authRoutes from './auth.routes';
import docsRoutes from './docs.routes';
import tourRoutes from './tour.routes';
import blogRoutes from './blog.routes';

const router = Router();

// Mount v1 routes
router.use('/auth', authRoutes);
router.use('/docs', docsRoutes);
router.use('/tours', tourRoutes);
router.use('/blogs', blogRoutes);

export default router;
