-- ==============================================================================
-- MIGRATION 002: Add JSONB multi-links support for entries
-- ==============================================================================

-- 1. Add `links` JSONB column defaulting to empty array
ALTER TABLE public.entries 
ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing single `link` into `links` array of {label, url}
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'entries' 
          AND column_name = 'link'
    ) THEN
        UPDATE public.entries 
        SET links = jsonb_build_array(
            jsonb_build_object('label', 'View Resource', 'url', link)
        )
        WHERE link IS NOT NULL 
          AND link <> '' 
          AND (links IS NULL OR links = '[]'::jsonb);

        -- 3. Drop legacy single link column
        ALTER TABLE public.entries DROP COLUMN IF EXISTS link;
    END IF;
END $$;
