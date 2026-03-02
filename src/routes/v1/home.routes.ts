import { Router } from 'express';
import { HomeController } from '../../controllers/home.controller';
import { validate } from '../../middleware/validator';
import { searchToursSchema } from '../../validators/home.validator';

const router = Router();

// GET /api/v1/home/search?from=YYYY-MM-DD&to=YYYY-MM-DD&destination=<Region>
router.get('/search', validate(searchToursSchema), HomeController.searchTours);

// GET /api/v1/home/recommended
router.get('/recommended', HomeController.recommendedTours);

export default router;
