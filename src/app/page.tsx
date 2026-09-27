import React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DynamicSection } from "@/components/DynamicSection";
import { Footer } from "@/components/Footer";
import { getPortfolioData } from "@/lib/supabase";

export const revalidate = 0; // Dynamic server-side rendering for up-to-date Supabase data

export default async function Home() {
  const { profile, sections, socialLinks } = await getPortfolioData();

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F4F0] text-[#111111]">
      <Header name={profile.name} sections={sections} />
      <Hero profile={profile} sections={sections} />
      
      {/* Dynamically render all visible sections ordered by display_order */}
      {sections.map((section, idx) => (
        <DynamicSection key={section.id} section={section} index={idx} />
      ))}

      <Footer
        email={profile.email}
        socialLinks={socialLinks}
        sectionIndex={sections.length + 1}
      />
    </main>
  );
}
