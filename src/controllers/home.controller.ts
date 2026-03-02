import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { sendSuccess } from '../utils/response';
import { ValidationError, InternalError } from '../utils/errors';
import { SearchToursQuery } from '../validators/home.validator';

const mapTour = (tour: any) => ({
  id: tour.id,
  title: tour.title,
  description: tour.description,
  region: tour.region,
  types: tour.types,
  season: tour.season,
  durationDays: tour.duration_days,
  durationNights: tour.duration_nights,
  photoUrl: tour.photo_url,
  isCustom: tour.is_custom,
  isDescriptionFilled: tour.is_description_filled,
  createdAt: tour.created_at,
  updatedAt: tour.updated_at,
});

export class HomeController {
  /**
   * Search tours by destination and date range (Public)
   * Counts days between from/to and returns tours where duration_days <= dayCount
   */
  static async searchTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to, destination } = req.query as SearchToursQuery;

      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new ValidationError('Invalid date format. Use YYYY-MM-DD.');
      }

      if (toDate <= fromDate) {
        throw new ValidationError('"to" date must be after "from" date.');
      }

      const diffMs = toDate.getTime() - fromDate.getTime();
      const dayCount = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const { data, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .eq('region', destination)
        .lte('duration_days', dayCount)
        .order('duration_days', { ascending: false });

      if (error) {
        console.error('Database error searching tours:', error);
        throw new InternalError('Failed to fetch tours');
      }

      sendSuccess(res, {
        dayCount,
        destination,
        tours: (data || []).map(mapTour),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get 3 randomized recommended tours (Public)
   */
  static async recommendedTours(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin.from('tours').select('*');

      if (error) {
        console.error('Database error fetching tours:', error);
        throw new InternalError('Failed to fetch tours');
      }

      const all = data || [];

      // Fisher-Yates shuffle
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }

      sendSuccess(res, {
        tours: all.slice(0, 3).map(mapTour),
      });
    } catch (error) {
      next(error);
    }
  }
}
