import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ValidationError, InternalError } from '../utils/errors';
import { CreateTourInput, UpdateTourInput, GetToursQuery } from '../validators/tour.validator';

export class TourController {
  /**
   * Create a new tour (Admin only)
   */
  static async createTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        title,
        description,
        region,
        types,
        season,
        durationDays,
        durationNights,
        photoUrl,
        isCustom,
      } = req.body as CreateTourInput;

      const { data, error } = await supabaseAdmin
        .from('tours')
        .insert({
          title,
          description,
          region,
          types,
          season,
          duration_days: durationDays,
          duration_nights: durationNights,
          photo_url: photoUrl,
          is_custom: isCustom ?? false,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating tour:', error);
        throw new ValidationError(error.message);
      }

      if (!data) {
        throw new InternalError('Failed to create tour');
      }

      sendSuccess(
        res,
        {
          tour: {
            id: data.id,
            title: data.title,
            description: data.description,
            region: data.region,
            types: data.types,
            season: data.season,
            durationDays: data.duration_days,
            durationNights: data.duration_nights,
            photoUrl: data.photo_url,
            isCustom: data.is_custom,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          },
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tours with optional filters (Public)
   */
  static async getTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { region, season, types, isCustom, page = '1', limit = '10' } = req.query as GetToursQuery;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = supabaseAdmin.from('tours').select('*', { count: 'exact' });

      // Apply filters
      if (region) {
        query = query.eq('region', region);
      }

      if (season) {
        query = query.eq('season', season);
      }

      if (types) {
        // types is comma-separated string, convert to array
        const typesArray = types.split(',').map(t => t.trim());
        query = query.contains('types', typesArray);
      }

      if (isCustom !== undefined) {
        query = query.eq('is_custom', isCustom === 'true');
      }

      // Apply pagination
      query = query.range(offset, offset + limitNum - 1).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Database error fetching tours:', error);
        throw new InternalError('Failed to fetch tours');
      }

      const tours = (data || []).map(tour => ({
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
        createdAt: tour.created_at,
        updatedAt: tour.updated_at,
      }));

      sendSuccess(res, {
        tours,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single tour by ID (Public)
   */
  static async getTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin.from('tours').select('*').eq('id', id).single();

      if (error || !data) {
        throw new NotFoundError('Tour not found');
      }

      sendSuccess(res, {
        tour: {
          id: data.id,
          title: data.title,
          description: data.description,
          region: data.region,
          types: data.types,
          season: data.season,
          durationDays: data.duration_days,
          durationNights: data.duration_nights,
          photoUrl: data.photo_url,
          isCustom: data.is_custom,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a tour (Admin only)
   */
  static async updateTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body as UpdateTourInput;

      // Map camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.region !== undefined) dbUpdates.region = updates.region;
      if (updates.types !== undefined) dbUpdates.types = updates.types;
      if (updates.season !== undefined) dbUpdates.season = updates.season;
      if (updates.durationDays !== undefined) dbUpdates.duration_days = updates.durationDays;
      if (updates.durationNights !== undefined) dbUpdates.duration_nights = updates.durationNights;
      if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
      if (updates.isCustom !== undefined) dbUpdates.is_custom = updates.isCustom;

      const { data, error } = await supabaseAdmin
        .from('tours')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        if (error?.code === 'PGRST116') {
          throw new NotFoundError('Tour not found');
        }
        throw new ValidationError(error?.message || 'Failed to update tour');
      }

      sendSuccess(res, {
        tour: {
          id: data.id,
          title: data.title,
          description: data.description,
          region: data.region,
          types: data.types,
          season: data.season,
          durationDays: data.duration_days,
          durationNights: data.duration_nights,
          photoUrl: data.photo_url,
          isCustom: data.is_custom,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a tour (Admin only)
   */
  static async deleteTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin.from('tours').delete().eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Tour not found');
        }
        throw new InternalError(error.message);
      }

      sendSuccess(res, {
        message: 'Tour deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
