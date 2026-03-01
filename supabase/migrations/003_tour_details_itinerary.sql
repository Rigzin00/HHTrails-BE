-- ============================================================
-- Migration 003: Tour Details & Itinerary Tables
-- Run this in Supabase SQL Editor after migration 002
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Alter tours table for existing DBs
--    (safe to re-run — IF NOT EXISTS guards)
-- ─────────────────────────────────────────

-- Make description nullable (is stored in tour_details.overview hereafter)
ALTER TABLE public.tours
  ALTER COLUMN description DROP NOT NULL;

-- Track whether full details have been filled in
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS is_description_filled boolean NOT NULL DEFAULT false;

-- ─────────────────────────────────────────
-- 2. check_tour_completion trigger function
--    Called by both tour_details and tour_itinerary triggers.
--    Sets tours.is_description_filled = true when tour_details
--    exists and all required fields are non-empty.
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.check_tour_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tour_id uuid;
  v_details_complete boolean;
BEGIN
  -- Resolve tour_id regardless of operation type
  IF TG_OP = 'DELETE' THEN
    v_tour_id := OLD.tour_id;
  ELSE
    v_tour_id := NEW.tour_id;
  END IF;

  -- Completion = tour_details row exists with all required fields non-empty
  SELECT EXISTS (
    SELECT 1
    FROM public.tour_details
    WHERE tour_id = v_tour_id
      AND overview  IS NOT NULL AND overview  <> ''
      AND cardinality(highlights) > 0
      AND cardinality(inclusions)  > 0
      AND cardinality(exclusions)  > 0
  ) INTO v_details_complete;

  -- Push the flag back to the parent tours row
  UPDATE public.tours
  SET is_description_filled = v_details_complete
  WHERE id = v_tour_id;

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- ─────────────────────────────────────────
-- 3. tour_details table
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tour_details (
  id                       uuid                     NOT NULL DEFAULT gen_random_uuid(),
  tour_id                  uuid                     NOT NULL,
  overview                 text                     NOT NULL,
  highlights               text[]                   NOT NULL DEFAULT '{}'::text[],
  inclusions               text[]                   NOT NULL DEFAULT '{}'::text[],
  exclusions               text[]                   NOT NULL DEFAULT '{}'::text[],
  accommodation_description text                    NULL,
  accommodation_media_url  text                     NULL,
  feature_description      text                     NULL,
  feature_media_url        text                     NULL,
  feature_is_video         boolean                  NOT NULL DEFAULT false,
  route_description        text                     NULL,
  route_photo_url          text                     NULL,
  created_at               timestamp with time zone NOT NULL DEFAULT now(),
  updated_at               timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tour_details_pkey    PRIMARY KEY (id),
  CONSTRAINT unique_tour_details  UNIQUE (tour_id),
  CONSTRAINT fk_tour              FOREIGN KEY (tour_id)
    REFERENCES public.tours (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- updated_at trigger for tour_details
CREATE TRIGGER set_updated_at_tour_details
  BEFORE UPDATE ON public.tour_details
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Completion check trigger for tour_details
CREATE TRIGGER trigger_check_completion_details
  AFTER INSERT OR UPDATE OR DELETE ON public.tour_details
  FOR EACH ROW
  EXECUTE FUNCTION check_tour_completion();

-- ─────────────────────────────────────────
-- 4. tour_itinerary table
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tour_itinerary (
  id          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  tour_id     uuid                     NOT NULL,
  day_number  integer                  NOT NULL,
  description text                     NOT NULL,
  image_url   text                     NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT now(),
  updated_at  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tour_itinerary_pkey    PRIMARY KEY (id),
  CONSTRAINT unique_day_per_tour    UNIQUE (tour_id, day_number),
  CONSTRAINT fk_tour_itinerary      FOREIGN KEY (tour_id)
    REFERENCES public.tours (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- updated_at trigger for tour_itinerary
CREATE TRIGGER set_updated_at_tour_itinerary
  BEFORE UPDATE ON public.tour_itinerary
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Completion check trigger for tour_itinerary
-- (re-evaluates is_description_filled — ready for future rules)
CREATE TRIGGER trigger_check_completion_itinerary
  AFTER INSERT OR UPDATE OR DELETE ON public.tour_itinerary
  FOR EACH ROW
  EXECUTE FUNCTION check_tour_completion();

-- ─────────────────────────────────────────
-- 5. RLS policies
-- ─────────────────────────────────────────

ALTER TABLE public.tour_details   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_itinerary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tour_details"
  ON public.tour_details FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tour_itinerary"
  ON public.tour_itinerary FOR SELECT USING (true);
