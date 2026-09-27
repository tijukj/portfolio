import React from "react";
import { Profile, Section } from "@/types/database";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  profile: Profile;
  sections: Section[];
}

export function Hero({ profile, sections }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-[#111111] text-xs uppercase tracking-swiss text-[#555555]">
          <div className="md:col-span-3">
            <span className="text-[#111111] font-bold block">LOCATION</span>
            <span>{profile.location || "GLOBAL / INDIA"}</span>
          </div>
          <div className="md:col-span-4">
            <span className="text-[#111111] font-bold block">STATUS</span>
            <span>{profile.status || "AVAILABLE FOR STRATEGIC ROLES"}</span>
          </div>
          <div className="md:col-span-5 md:text-right flex items-center md:justify-end gap-2 text-[#111111]">
            <span className="inline-block w-2 h-2 bg-[#111111]"></span>
            <span>SWISS CMS V2.0 • SUPABASE</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 items-start">
          {/* Left Column: Big Headline & Info (8 columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-swiss font-bold text-[#555555] mb-3">
                CURRICULUM VITAE & SELECTED WORKS
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tightest leading-[0.88] text-[#111111] mb-6">
                {profile.name}
              </h1>
              
              <div className="inline-block border-l-2 border-[#111111] pl-4 py-1 mb-8">
                <p className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
                  {profile.tagline}
                </p>
              </div>

              <p className="text-base sm:text-lg text-[#333333] max-w-2xl leading-relaxed mb-10">
                {profile.intro}
              </p>
            </div>

            {/* Dynamic quick action links based on active sections */}
            <div className="pt-6 border-t border-[#111111] grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sections.slice(0, 4).map((section, idx) => {
                const sectionHref = `#${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || section.type}`;
                return (
                  <a
                    key={section.id}
                    href={sectionHref}
                    className="group flex flex-col p-3 border border-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs tracking-swiss uppercase font-mono">
                      <span>{(idx + 1).toString().padStart(2, "0")}</span>
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-swiss mt-4 truncate">
                      {section.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Photo placeholder or Supabase Photo (4 columns) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative aspect-[3/4] w-full border border-[#111111] bg-[#EAE7DF] flex flex-col justify-between p-4 overflow-hidden group">
              {/* Top labels */}
              <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-swiss text-[#555555] z-10">
                <span>FIG 0.1</span>
                <span>{profile.photo_url ? "PORTRAIT IDENTIFIER" : "PORTRAIT PLACEHOLDER"}</span>
              </div>

              {/* Photo Image or Wireframe placeholder */}
              {profile.photo_url ? (
                <div className="relative w-full h-full my-2 overflow-hidden filter grayscale contrast-125">
                  <Image
                    src={profile.photo_url}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="my-auto flex flex-col items-center justify-center text-center p-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 border border-[#111111] border-dashed flex items-center justify-center mb-4 relative">
                    <span className="text-3xl font-light text-[#111111] select-none">+</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-full h-[1px] bg-[#111111]"></div>
                      <div className="h-full w-[1px] bg-[#111111] absolute"></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-swiss text-[#111111]">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#777777] mt-1">
                    [1200 x 1600 PX • GRAYSCALE]
                  </span>
                </div>
              )}

              {/* Bottom metadata stamp */}
              <div className="pt-2 border-t border-[#111111]/30 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-[#555555] z-10">
                <span>SCALE: 1:1</span>
                <span>ID: {profile.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
