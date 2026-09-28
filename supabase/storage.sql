-- ==============================================================================
-- STORAGE BUCKET: portfolio-media (Public)
-- ==============================================================================

-- Create public bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media',
    'portfolio-media',
    true,
    52428800, -- 50 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to view media
DROP POLICY IF EXISTS "Allow public read on portfolio-media" ON storage.objects;
CREATE POLICY "Allow public read on portfolio-media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-media');

-- Allow service role full access (insert/update/delete)
DROP POLICY IF EXISTS "Allow service role all on portfolio-media" ON storage.objects;
CREATE POLICY "Allow service role all on portfolio-media"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');
