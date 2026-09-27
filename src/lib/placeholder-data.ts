export interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
  link?: string;
  tags?: string[];
}

export interface HeroData {
  name: string;
  role: string;
  location: string;
  bio: string;
  status: string;
  photoUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
}

export interface ContactData {
  email: string;
  availability: string;
  socials: SocialLink[];
}

export const heroData: HeroData = {
  name: "TIJU K JOHN",
  role: "MBA Candidate — Marketing & Operations",
  location: "Kochi / Bengaluru, India",
  bio: "Blending data-driven operations, brand strategy, and modern digital systems to build high-leverage products and workflows.",
  status: "Available for strategic roles & consulting",
};

export const navItems = [
  { label: "EXPERIENCE", href: "#experience", index: "01" },
  { label: "PROJECTS", href: "#projects", index: "02" },
  { label: "APPS", href: "#apps", index: "03" },
  { label: "AWARDS", href: "#awards", index: "04" },
  { label: "CONTACT", href: "#contact", index: "05" },
];

export const experienceData: PortfolioItem[] = [
  {
    id: "exp-1",
    title: "Operations & Growth Strategist",
    subtitle: "Vanguard Mobility & Logistics",
    date: "2023 — Present",
    description: "Streamlined last-mile distribution networks and led cross-functional operational improvements, improving dispatch throughput by 28%.",
    tags: ["Operations", "Process Optimization", "Logistics"],
  },
  {
    id: "exp-2",
    title: "Associate Product Marketing Manager",
    subtitle: "Kinetix Digital Labs",
    date: "2021 — 2023",
    description: "Architected go-to-market positioning and customer acquisition funnels for B2B workflow tools, scaling organic lead conversion by 35%.",
    tags: ["Product Marketing", "GTM Strategy", "B2B Analytics"],
  },
  {
    id: "exp-3",
    title: "Business Analyst Intern",
    subtitle: "Meridian Advisory Partners",
    date: "2020 — 2021",
    description: "Conducted market feasibility studies, competitor benchmarking, and financial modeling for early-stage direct-to-consumer ventures.",
    tags: ["Market Research", "Financial Modeling", "Benchmarking"],
  },
];

export const projectData: PortfolioItem[] = [
  {
    id: "proj-1",
    title: "Cold-Chain Supply Chain Resilience Audit",
    subtitle: "Industrial Research & Analytics",
    date: "2024",
    description: "Comprehensive multi-node audit analyzing temperature-sensitive supply chain vulnerabilities, routing inefficiencies, and wastage mitigation.",
    link: "https://example.com/supply-chain-audit",
    tags: ["Supply Chain", "Research", "Optimization"],
  },
  {
    id: "proj-2",
    title: "Omnichannel D2C Brand Acquisition Model",
    subtitle: "Strategic Marketing Framework",
    date: "2023",
    description: "Formulated a unified customer lifetime value (LTV) forecasting framework across blended digital advertising and retail shelf presence.",
    link: "https://example.com/d2c-growth-model",
    tags: ["Growth Marketing", "Unit Economics", "LTV Modeling"],
  },
  {
    id: "proj-3",
    title: "Regional Logistics Hub Allocation System",
    subtitle: "Spatial Optimization Study",
    date: "2023",
    description: "Mathematical modeling of optimal micro-warehouse placement across tier-2 urban clusters to minimize transit latency.",
    link: "https://example.com/hub-allocation",
    tags: ["Spatial Analysis", "Network Design", "Operations"],
  },
];

export const appData: PortfolioItem[] = [
  {
    id: "app-1",
    title: "Inventory Matrix & Velocity Engine",
    subtitle: "Operational Web Utility",
    date: "2024",
    description: "A lightweight dashboard computing SKU reorder triggers, stock-out probabilities, and supplier lead-time variances in real time.",
    link: "https://example.com/inventory-engine",
    tags: ["Web App", "Next.js", "Analytics"],
  },
  {
    id: "app-2",
    title: "RouteOptima Dispatch Planner",
    subtitle: "Algorithmic Routing CLI & GUI",
    date: "2024",
    description: "Multi-stop vehicle routing optimizer tailored for urban delivery clusters with dynamic constraint handling.",
    link: "https://example.com/route-optima",
    tags: ["TypeScript", "Routing Algorithm", "Tooling"],
  },
  {
    id: "app-3",
    title: "BrandPulse Sentiment Terminal",
    subtitle: "Market Intelligence Tool",
    date: "2023",
    description: "Aggregates customer reviews, social sentiment signals, and competitor pricing shifts into an executive markdown briefing.",
    link: "https://example.com/brand-pulse",
    tags: ["Market Intel", "Automation", "Dashboard"],
  },
];

export const awardData: PortfolioItem[] = [
  {
    id: "award-1",
    title: "Young Kerala Fellowship",
    subtitle: "Government of Kerala & Planning Board",
    date: "2023 — 2024",
    description: "Selected for the prestigious policy and public administration fellowship, contributing to regional strategic infrastructure and youth leadership initiatives.",
    tags: ["Fellowship", "Leadership", "Public Policy"],
  },
  {
    id: "award-2",
    title: "National Case Championship Finalist",
    subtitle: "Apex Business Conclave",
    date: "2023",
    description: "Recognized among the top 5 nationwide teams for formulating a sustainable turnaround strategy for legacy manufacturing hubs.",
    tags: ["Case Competition", "Strategy"],
  },
  {
    id: "award-3",
    title: "Academic Excellence Merit Scholar",
    subtitle: "Dean's Honor Roll",
    date: "2021",
    description: "Awarded top percentile standing for exceptional scholastic performance in quantitative methods and operations management.",
    tags: ["Academic Honors", "Quantitative"],
  },
];

export const contactData: ContactData = {
  email: "tijukjohn@example.com",
  availability: "Open to full-time roles, strategic partnerships, and consulting engagements.",
  socials: [
    {
      id: "social-linkedin",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/tijukjohn",
      label: "linkedin.com/in/tijukjohn",
    },
    {
      id: "social-github",
      platform: "GitHub",
      url: "https://github.com/tijukjohn",
      label: "github.com/tijukjohn",
    },
    {
      id: "social-twitter",
      platform: "Twitter / X",
      url: "https://twitter.com/tijukjohn",
      label: "twitter.com/tijukjohn",
    },
  ],
};
