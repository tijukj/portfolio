import { createClient } from "@supabase/supabase-js";
import { Profile, Section, SocialLink, Entry } from "@/types/database";
import {
  heroData,
  experienceData,
  projectData,
  appData,
  awardData,
  contactData,
} from "./placeholder-data";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface PortfolioFullData {
  profile: Profile;
  sections: Section[];
  socialLinks: SocialLink[];
}

export async function getPortfolioData(): Promise<PortfolioFullData> {
  // If Supabase is configured, fetch live data from database
  if (isSupabaseConfigured && supabase) {
    try {
      const [profileRes, sectionsRes, entriesRes, socialsRes] = await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("sections").select("*").eq("visible", true).order("display_order", { ascending: true }),
        supabase.from("entries").select("*").order("display_order", { ascending: true }),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (sectionsRes.data && profileRes.data) {
        // Group entries into sections
        const rawEntries = (entriesRes.data as Entry[]) || [];
        const entriesBySection: Record<string, Entry[]> = {};
        for (const entry of rawEntries) {
          if (!entriesBySection[entry.section_id]) {
            entriesBySection[entry.section_id] = [];
          }
          entriesBySection[entry.section_id].push(entry);
        }

        const sectionsWithEntries: Section[] = (sectionsRes.data as Section[]).map((section) => ({
          ...section,
          entries: entriesBySection[section.id] || [],
        }));

        return {
          profile: profileRes.data as Profile,
          sections: sectionsWithEntries,
          socialLinks: (socialsRes.data as SocialLink[]) || [],
        };
      }
    } catch (err) {
      console.error("Error fetching data from Supabase, using fallback:", err);
    }
  }

  // Fallback to initial structured data if DB not yet seeded or configured
  const fallbackSections: Section[] = [
    {
      id: "sec-exp",
      type: "experience",
      title: "Experience",
      display_order: 1,
      visible: true,
      entries: experienceData.map((e, idx) => ({
        id: e.id,
        section_id: "sec-exp",
        title: e.title,
        subtitle: e.subtitle || null,
        date_range: e.date || null,
        description: e.description || null,
        link: e.link || null,
        tags: e.tags || null,
        display_order: idx + 1,
      })),
    },
    {
      id: "sec-proj",
      type: "project",
      title: "Projects",
      display_order: 2,
      visible: true,
      entries: projectData.map((p, idx) => ({
        id: p.id,
        section_id: "sec-proj",
        title: p.title,
        subtitle: p.subtitle || null,
        date_range: p.date || null,
        description: p.description || null,
        link: p.link || null,
        tags: p.tags || null,
        display_order: idx + 1,
      })),
    },
    {
      id: "sec-app",
      type: "app",
      title: "Applications",
      display_order: 3,
      visible: true,
      entries: appData.map((a, idx) => ({
        id: a.id,
        section_id: "sec-app",
        title: a.title,
        subtitle: a.subtitle || null,
        date_range: a.date || null,
        description: a.description || null,
        link: a.link || null,
        tags: a.tags || null,
        display_order: idx + 1,
      })),
    },
    {
      id: "sec-award",
      type: "award",
      title: "Awards",
      display_order: 4,
      visible: true,
      entries: awardData.map((aw, idx) => ({
        id: aw.id,
        section_id: "sec-award",
        title: aw.title,
        subtitle: aw.subtitle || null,
        date_range: aw.date || null,
        description: aw.description || null,
        link: aw.link || null,
        tags: aw.tags || null,
        display_order: idx + 1,
      })),
    },
  ];

  return {
    profile: {
      id: "profile-1",
      name: heroData.name,
      tagline: heroData.role,
      intro: heroData.bio,
      photo_url: null,
      email: contactData.email,
      location: heroData.location,
      status: heroData.status,
    },
    sections: fallbackSections,
    socialLinks: contactData.socials.map((s, idx) => ({
      id: s.id,
      platform: s.platform,
      url: s.url,
      display_order: idx + 1,
      label: s.label,
    })),
  };
}
