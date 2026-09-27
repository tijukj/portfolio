import React from "react";
import { experienceData } from "@/lib/placeholder-data";
import { SectionHeader } from "./SectionHeader";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-16 sm:py-24 border-b border-[#111111] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="01"
          category="PROFESSIONAL TRAJECTORY"
          title="EXPERIENCE"
          count={experienceData.length}
        />

        <div className="divide-y divide-[#111111] border-y border-[#111111]">
          {experienceData.map((item, idx) => (
            <div
              key={item.id}
              className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 items-start group"
            >
              {/* Col 1-3: Number & Date */}
              <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-2">
                <span className="text-xs font-mono font-bold tracking-swiss text-[#555555]">
                  / {(idx + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-[#111111] font-semibold">
                  {item.date}
                </span>
              </div>

              {/* Col 4-8: Role, Organization & Description */}
              <div className="md:col-span-6 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-swiss text-[#555555]">
                    {item.subtitle}
                  </p>
                )}
                <p className="text-sm sm:text-base text-[#333333] leading-relaxed pt-2">
                  {item.description}
                </p>
              </div>

              {/* Col 9-12: Tags */}
              <div className="md:col-span-3 flex flex-wrap gap-1.5 md:justify-end mt-2 md:mt-0">
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-swiss font-mono px-2 py-1 border border-[#111111] text-[#111111]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
