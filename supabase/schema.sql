-- ==============================================================================
-- 1. DATABASE SCHEMA: Swiss Portfolio CMS
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: sections
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('experience', 'project', 'app', 'award', 'custom')),
    title TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: entries
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    date_range TEXT,
    description TEXT,
    link TEXT,
    tags TEXT[],
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: profile
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    intro TEXT NOT NULL,
    photo_url TEXT,
    email TEXT
);

-- Table: social_links
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

-- ==============================================================================
-- 2. ROW LEVEL SECURITY (RLS) & PUBLIC READ POLICIES
-- ==============================================================================

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Allow public read (SELECT) on all tables
DROP POLICY IF EXISTS "Allow public read on sections" ON public.sections;
CREATE POLICY "Allow public read on sections" ON public.sections
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on entries" ON public.entries;
CREATE POLICY "Allow public read on entries" ON public.entries
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on profile" ON public.profile;
CREATE POLICY "Allow public read on profile" ON public.profile
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on social_links" ON public.social_links;
CREATE POLICY "Allow public read on social_links" ON public.social_links
    FOR SELECT TO anon, authenticated USING (true);
