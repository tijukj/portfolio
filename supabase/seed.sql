-- ==============================================================================
-- 3. SEED DATA: Swiss Portfolio Initial Content
-- ==============================================================================

-- Clear existing data (optional for clean re-seeding)
TRUNCATE TABLE public.entries, public.sections, public.profile, public.social_links CASCADE;

-- Insert Profile
INSERT INTO public.profile (id, name, tagline, intro, photo_url, email)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'TIJU K JOHN',
    'MBA Candidate — Marketing & Operations',
    'Blending data-driven operations, brand strategy, and modern digital systems to build high-leverage products and workflows.',
    NULL,
    'tijukjohn@example.com'
);

-- Insert Social Links
INSERT INTO public.social_links (platform, url, display_order) VALUES
    ('LinkedIn', 'https://linkedin.com/in/tijukjohn', 1),
    ('GitHub', 'https://github.com/tijukjohn', 2),
    ('Twitter / X', 'https://twitter.com/tijukjohn', 3);

-- Insert Sections
INSERT INTO public.sections (id, type, title, display_order, visible) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'experience', 'Experience', 1, true),
    ('b0000000-0000-0000-0000-000000000002', 'project', 'Projects', 2, true),
    ('b0000000-0000-0000-0000-000000000003', 'app', 'Applications', 3, true),
    ('b0000000-0000-0000-0000-000000000004', 'award', 'Awards', 4, true);

-- Insert Entries for Experience (Section 1)
INSERT INTO public.entries (section_id, title, subtitle, date_range, description, link, tags, display_order) VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'Operations & Growth Strategist',
    'Vanguard Mobility & Logistics',
    '2023 — Present',
    'Streamlined last-mile distribution networks and led cross-functional operational improvements, improving dispatch throughput by 28%.',
    NULL,
    ARRAY['Operations', 'Process Optimization', 'Logistics'],
    1
),
(
    'b0000000-0000-0000-0000-000000000001',
    'Associate Product Marketing Manager',
    'Kinetix Digital Labs',
    '2021 — 2023',
    'Architected go-to-market positioning and customer acquisition funnels for B2B workflow tools, scaling organic lead conversion by 35%.',
    NULL,
    ARRAY['Product Marketing', 'GTM Strategy', 'B2B Analytics'],
    2
),
(
    'b0000000-0000-0000-0000-000000000001',
    'Business Analyst Intern',
    'Meridian Advisory Partners',
    '2020 — 2021',
    'Conducted market feasibility studies, competitor benchmarking, and financial modeling for early-stage direct-to-consumer ventures.',
    NULL,
    ARRAY['Market Research', 'Financial Modeling', 'Benchmarking'],
    3
);

-- Insert Entries for Projects (Section 2)
INSERT INTO public.entries (section_id, title, subtitle, date_range, description, link, tags, display_order) VALUES
(
    'b0000000-0000-0000-0000-000000000002',
    'Cold-Chain Supply Chain Resilience Audit',
    'Industrial Research & Analytics',
    '2024',
    'Comprehensive multi-node audit analyzing temperature-sensitive supply chain vulnerabilities, routing inefficiencies, and wastage mitigation.',
    'https://example.com/supply-chain-audit',
    ARRAY['Supply Chain', 'Research', 'Optimization'],
    1
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Omnichannel D2C Brand Acquisition Model',
    'Strategic Marketing Framework',
    '2023',
    'Formulated a unified customer lifetime value (LTV) forecasting framework across blended digital advertising and retail shelf presence.',
    'https://example.com/d2c-growth-model',
    ARRAY['Growth Marketing', 'Unit Economics', 'LTV Modeling'],
    2
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Regional Logistics Hub Allocation System',
    'Spatial Optimization Study',
    '2023',
    'Mathematical modeling of optimal micro-warehouse placement across tier-2 urban clusters to minimize transit latency.',
    'https://example.com/hub-allocation',
    ARRAY['Spatial Analysis', 'Network Design', 'Operations'],
    3
);

-- Insert Entries for Apps (Section 3)
INSERT INTO public.entries (section_id, title, subtitle, date_range, description, link, tags, display_order) VALUES
(
    'b0000000-0000-0000-0000-000000000003',
    'Inventory Matrix & Velocity Engine',
    'Operational Web Utility',
    '2024',
    'A lightweight dashboard computing SKU reorder triggers, stock-out probabilities, and supplier lead-time variances in real time.',
    'https://example.com/inventory-engine',
    ARRAY['Web App', 'Next.js', 'Analytics'],
    1
),
(
    'b0000000-0000-0000-0000-000000000003',
    'RouteOptima Dispatch Planner',
    'Algorithmic Routing CLI & GUI',
    '2024',
    'Multi-stop vehicle routing optimizer tailored for urban delivery clusters with dynamic constraint handling.',
    'https://example.com/route-optima',
    ARRAY['TypeScript', 'Routing Algorithm', 'Tooling'],
    2
),
(
    'b0000000-0000-0000-0000-000000000003',
    'BrandPulse Sentiment Terminal',
    'Market Intelligence Tool',
    '2023',
    'Aggregates customer reviews, social sentiment signals, and competitor pricing shifts into an executive markdown briefing.',
    'https://example.com/brand-pulse',
    ARRAY['Market Intel', 'Automation', 'Dashboard'],
    3
);

-- Insert Entries for Awards (Section 4 - including Young Kerala Fellowship)
INSERT INTO public.entries (section_id, title, subtitle, date_range, description, link, tags, display_order) VALUES
(
    'b0000000-0000-0000-0000-000000000004',
    'Young Kerala Fellowship',
    'Government of Kerala & Planning Board',
    '2023 — 2024',
    'Selected for the prestigious policy and public administration fellowship, contributing to regional strategic infrastructure and youth leadership initiatives.',
    NULL,
    ARRAY['Fellowship', 'Leadership', 'Public Policy'],
    1
),
(
    'b0000000-0000-0000-0000-000000000004',
    'National Case Championship Finalist',
    'Apex Business Conclave',
    '2023',
    'Recognized among the top 5 nationwide teams for formulating a sustainable turnaround strategy for legacy manufacturing hubs.',
    NULL,
    ARRAY['Case Competition', 'Strategy'],
    2
),
(
    'b0000000-0000-0000-0000-000000000004',
    'Academic Excellence Merit Scholar',
    'Dean''s Honor Roll',
    '2021',
    'Awarded top percentile standing for exceptional scholastic performance in quantitative methods and operations management.',
    NULL,
    ARRAY['Academic Honors', 'Quantitative'],
    3
);
