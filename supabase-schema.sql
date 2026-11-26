-- ==============================================================================
-- RIVANI ART - SUPABASE DATABASE SCHEMA & POLICIES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create artworks table
CREATE TABLE IF NOT EXISTS public.artworks (
    id BIGSERIAL PRIMARY KEY,
    canonical_id BIGINT,
    primary_card_id BIGINT,
    card_ids JSONB DEFAULT '[]'::jsonb,
    title TEXT NOT NULL,
    canonical_title TEXT,
    source_title TEXT,
    artist TEXT DEFAULT 'Rivani Atelier',
    category TEXT DEFAULT 'Abstract',
    orientation TEXT DEFAULT 'Portrait',
    medium TEXT,
    support TEXT DEFAULT 'canvas',
    dimensions TEXT,
    height_cm NUMERIC,
    width_cm NUMERIC,
    height_in NUMERIC,
    width_in NUMERIC,
    panel_count INTEGER DEFAULT 1,
    frame_type TEXT,
    frame_material TEXT,
    frame_colour TEXT,
    frame_finish TEXT,
    mount_liner TEXT,
    framed_description TEXT,
    framed_dimensions TEXT,
    price TEXT DEFAULT 'Price on Request',
    price_inr NUMERIC,
    description TEXT,
    verification_status TEXT DEFAULT 'verified_tier',
    duplicate_group TEXT,
    status TEXT DEFAULT 'published',
    image TEXT,
    primary_image TEXT,
    views JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-speed catalog querying & filtering
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks (status);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks (category);
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON public.artworks (slug);

-- 2. Create Storage Bucket for Artwork Images (Publicly readable, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- 4. Policies for artworks table:
-- Everyone (public visitors worldwide) can view published artworks
DROP POLICY IF EXISTS "Public can view published artworks" ON public.artworks;
CREATE POLICY "Public can view published artworks" 
ON public.artworks 
FOR SELECT 
USING (status = 'published' OR auth.role() = 'authenticated');

-- Only logged-in admin users can insert new artworks
DROP POLICY IF EXISTS "Admins can insert artworks" ON public.artworks;
CREATE POLICY "Admins can insert artworks" 
ON public.artworks 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only logged-in admin users can update artworks
DROP POLICY IF EXISTS "Admins can update artworks" ON public.artworks;
CREATE POLICY "Admins can update artworks" 
ON public.artworks 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Only logged-in admin users can delete artworks
DROP POLICY IF EXISTS "Admins can delete artworks" ON public.artworks;
CREATE POLICY "Admins can delete artworks" 
ON public.artworks 
FOR DELETE 
TO authenticated 
USING (true);

-- 5. Storage Policies for 'artwork-images' bucket
-- Everyone can view images
DROP POLICY IF EXISTS "Public can view artwork images" ON storage.objects;
CREATE POLICY "Public can view artwork images"
ON storage.objects FOR SELECT
USING (bucket_id = 'artwork-images');

-- Only authenticated admins can upload images
DROP POLICY IF EXISTS "Admins can upload artwork images" ON storage.objects;
CREATE POLICY "Admins can upload artwork images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artwork-images');

-- Only authenticated admins can update/delete artwork images
DROP POLICY IF EXISTS "Admins can update artwork images" ON storage.objects;
CREATE POLICY "Admins can update artwork images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artwork-images');

DROP POLICY IF EXISTS "Admins can delete artwork images" ON storage.objects;
CREATE POLICY "Admins can delete artwork images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artwork-images');
