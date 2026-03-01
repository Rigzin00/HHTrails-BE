import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ValidationError, InternalError } from '../utils/errors';
import { CreateBlogInput, UpdateBlogInput, GetBlogsQuery } from '../validators/blog.validator';

// ─── Mapper ────────────────────────────────────────────────────────────────
const mapBlogRow = (row: Record<string, any>) => ({
  id: row.id,
  category: row.category,
  coverImageUrl: row.cover_image_url,
  title: row.title,
  shortDescription: row.short_description,
  content: row.content,
  authorName: row.author_name,
  publishedDate: row.published_date,
  readingTimeMinutes: row.reading_time_minutes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class BlogController {
  /**
   * GET /api/v1/blogs  (Public)
   * Returns paginated list of blogs, optionally filtered by category.
   * Ordered by published_date descending.
   */
  static async getBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, page = '1', limit = '10' } = req.query as GetBlogsQuery;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = supabaseAdmin
        .from('blogs')
        .select('*', { count: 'exact' });

      if (category) {
        query = query.eq('category', category);
      }

      query = query
        .order('published_date', { ascending: false })
        .range(offset, offset + limitNum - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Database error fetching blogs:', error);
        throw new InternalError('Failed to fetch blogs');
      }

      sendSuccess(res, {
        blogs: (data ?? []).map(mapBlogRow),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/blogs/:id  (Public)
   */
  static async getBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new NotFoundError('Blog not found');
      }

      sendSuccess(res, { blog: mapBlogRow(data) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/blogs  (Admin only)
   */
  static async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateBlogInput;

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .insert({
          category: body.category,
          cover_image_url: body.coverImageUrl,
          title: body.title,
          short_description: body.shortDescription,
          content: body.content,
          author_name: body.authorName,
          published_date: body.publishedDate ?? undefined, // falls back to DB DEFAULT (CURRENT_DATE)
          reading_time_minutes: body.readingTimeMinutes,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating blog:', error);
        throw new ValidationError(error.message);
      }

      if (!data) {
        throw new InternalError('Failed to create blog');
      }

      sendSuccess(res, { blog: mapBlogRow(data) }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/blogs/:id  (Admin only)
   */
  static async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body as UpdateBlogInput;

      const dbPatch: Record<string, unknown> = {};
      if (body.category !== undefined) dbPatch.category = body.category;
      if (body.coverImageUrl !== undefined) dbPatch.cover_image_url = body.coverImageUrl;
      if (body.title !== undefined) dbPatch.title = body.title;
      if (body.shortDescription !== undefined) dbPatch.short_description = body.shortDescription;
      if (body.content !== undefined) dbPatch.content = body.content;
      if (body.authorName !== undefined) dbPatch.author_name = body.authorName;
      if (body.publishedDate !== undefined) dbPatch.published_date = body.publishedDate;
      if (body.readingTimeMinutes !== undefined) dbPatch.reading_time_minutes = body.readingTimeMinutes;

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .update(dbPatch)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        if (error?.code === 'PGRST116') {
          throw new NotFoundError('Blog not found');
        }
        throw new ValidationError(error?.message ?? 'Failed to update blog');
      }

      sendSuccess(res, { blog: mapBlogRow(data) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/blogs/:id  (Admin only)
   */
  static async deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { error, count } = await supabaseAdmin
        .from('blogs')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        throw new InternalError(error.message);
      }

      if (!count || count === 0) {
        throw new NotFoundError('Blog not found');
      }

      sendSuccess(res, { message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
