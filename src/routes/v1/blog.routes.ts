import { Router } from 'express';
import { BlogController } from '../../controllers/blog.controller';
import { validate } from '../../middleware/validator';
import { requireAdmin } from '../../middleware/admin';
import {
  createBlogSchema,
  updateBlogSchema,
  blogIdParamSchema,
  getBlogsSchema,
} from '../../validators/blog.validator';

const router = Router();

// Public
router.get('/', validate(getBlogsSchema), BlogController.getBlogs);
router.get('/:id', validate(blogIdParamSchema), BlogController.getBlog);

// Admin
router.post('/', requireAdmin, validate(createBlogSchema), BlogController.createBlog);
router.put('/:id', requireAdmin, validate(updateBlogSchema), BlogController.updateBlog);
router.delete('/:id', requireAdmin, validate(blogIdParamSchema), BlogController.deleteBlog);

export default router;
