import { Router } from 'express';
import { TourController } from '../../controllers/tour.controller';
import { TourDetailsController } from '../../controllers/tour.details.controller';
import { TourItineraryController } from '../../controllers/tour.itinerary.controller';
import { validate } from '../../middleware/validator';
import { requireAdmin } from '../../middleware/admin';
import {
  createTourSchema,
  updateTourSchema,
  deleteTourSchema,
  getTourSchema,
  getToursSchema,
} from '../../validators/tour.validator';
import {
  createTourDetailsSchema,
  updateTourDetailsSchema,
  getTourDetailsSchema,
} from '../../validators/tour.details.validator';
import {
  createItineraryDaySchema,
  updateItineraryDaySchema,
  deleteItineraryDaySchema,
  getItinerarySchema,
} from '../../validators/tour.itinerary.validator';

const router = Router();

// ─── Tours ──────────────────────────────────────────────────────────────────
// Public
router.get('/', validate(getToursSchema), TourController.getTours);
router.get('/:id', validate(getTourSchema), TourController.getTour);
// Admin
router.post('/', requireAdmin, validate(createTourSchema), TourController.createTour);
router.put('/:id', requireAdmin, validate(updateTourSchema), TourController.updateTour);
router.delete('/:id', requireAdmin, validate(deleteTourSchema), TourController.deleteTour);

// ─── Tour Details ────────────────────────────────────────────────────────────
// Public
router.get('/:id/details', validate(getTourDetailsSchema), TourDetailsController.getTourDetails);
// Admin
router.post('/:id/details', requireAdmin, validate(createTourDetailsSchema), TourDetailsController.createTourDetails);
router.put('/:id/details', requireAdmin, validate(updateTourDetailsSchema), TourDetailsController.updateTourDetails);

// ─── Tour Itinerary ──────────────────────────────────────────────────────────
// Public
router.get('/:id/itinerary', validate(getItinerarySchema), TourItineraryController.getItinerary);
// Admin
router.post('/:id/itinerary', requireAdmin, validate(createItineraryDaySchema), TourItineraryController.addItineraryDay);
router.put('/:id/itinerary/:dayNumber', requireAdmin, validate(updateItineraryDaySchema), TourItineraryController.updateItineraryDay);
router.delete('/:id/itinerary/:dayNumber', requireAdmin, validate(deleteItineraryDaySchema), TourItineraryController.deleteItineraryDay);

export default router;
