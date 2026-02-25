import { Router } from 'express';
import { TourController } from '../../controllers/tour.controller';
import { validate } from '../../middleware/validator';
import { requireAdmin } from '../../middleware/admin';
import {
  createTourSchema,
  updateTourSchema,
  deleteTourSchema,
  getTourSchema,
  getToursSchema,
} from '../../validators/tour.validator';

const router = Router();

// Public routes - anyone can view tours
router.get('/', validate(getToursSchema), TourController.getTours);
router.get('/:id', validate(getTourSchema), TourController.getTour);

// Admin routes - require admin authentication
router.post('/', requireAdmin, validate(createTourSchema), TourController.createTour);
router.put('/:id', requireAdmin, validate(updateTourSchema), TourController.updateTour);
router.delete('/:id', requireAdmin, validate(deleteTourSchema), TourController.deleteTour);

export default router;
