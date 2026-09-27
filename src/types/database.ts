export type SectionType = 'experience' | 'project' | 'app' | 'award' | 'custom';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  display_order: number;
  visible: boolean;
  created_at?: string;
  entries?: Entry[];
}

export interface Entry {
  id: string;
  section_id: string;
  title: string;
  subtitle: string | null;
  date_range: string | null;
  description: string | null;
  link: string | null;
  tags: string[] | null;
  display_order: number;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  photo_url: string | null;
  email: string | null;
  location?: string | null;
  status?: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  label?: string;
}
