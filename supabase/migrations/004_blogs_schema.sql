-- ============================================================
-- Migration 004: Blogs Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blogs (
  id                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  category               text                     NOT NULL,
  cover_image_url        text                     NOT NULL,
  title                  text                     NOT NULL,
  short_description      text                     NOT NULL,
  content                text                     NOT NULL,
  author_name            text                     NOT NULL,
  published_date         date                     NOT NULL DEFAULT CURRENT_DATE,
  reading_time_minutes   integer                  NOT NULL,
  created_at             timestamp with time zone NOT NULL DEFAULT now(),
  updated_at             timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blogs_pkey             PRIMARY KEY (id),
  CONSTRAINT reading_time_positive  CHECK (reading_time_minutes > 0)
) TABLESPACE pg_default;

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_blogs_category
  ON public.blogs USING btree (category) TABLESPACE pg_default;

-- Index for ordering by published_date
CREATE INDEX IF NOT EXISTS idx_blogs_published_date
  ON public.blogs USING btree (published_date DESC) TABLESPACE pg_default;

-- updated_at trigger (reuses the same handle_updated_at function from previous migrations)
CREATE TRIGGER set_updated_at_blogs
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to blogs"
  ON public.blogs FOR SELECT
  USING (true);
