"use client";

import React, { useState } from "react";
import { Section, Entry, EntryLink } from "@/types/database";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRight, Terminal, Cpu, Award, Star } from "lucide-react";

interface DynamicSectionProps {
  section: Section;
  index: number;
}

export function DynamicSection({ section, index }: DynamicSectionProps) {
  const numberStr = (index + 1).toString().padStart(2, "0");
  const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || section.type;
  const entries = section.entries || [];

  // State for award-type interactive selection
  const [selectedAwardId, setSelectedAwardId] = useState<string>(entries[0]?.id || "");
  const activeAward = entries.find((e) => e.id === selectedAwardId) || entries[0];

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case "experience":
        return "PROFESSIONAL TRAJECTORY";
      case "project":
        return "SELECTED INITIATIVES & RESEARCH";
      case "app":
        return "SOFTWARE, TOOLS & UTILITIES";
      case "award":
        return "HONORS, FELLOWSHIPS & RECOGNITION";
      default:
        return "CURATED SELECTION";
    }
  };

  const getEntryLinks = (entry: Entry): EntryLink[] => {
    if (entry.links && Array.isArray(entry.links) && entry.links.length > 0) {
      return entry.links;
    }
    if (entry.link) {
      return [{ label: "View Resource", url: entry.link }];
    }
    return [];
  };

  const renderLinksRow = (entry: Entry, defaultEmptyLabel = "CASE STUDY ARCHIVE") => {
    const links = getEntryLinks(entry);
    if (links.length === 0) {
      return (
        <div className="pt-4 border-t border-[#111111] text-xs font-mono text-[#777777] uppercase">
          {defaultEmptyLabel}
        </div>
      );
    }

    return (
      <div className="pt-4 border-t border-[#111111] flex flex-wrap gap-3">
        {links.map((linkItem, lIdx) => (
          <a
            key={lIdx}
            href={linkItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-swiss text-[#111111] hover:underline underline-offset-4 group"
          >
            <span>{linkItem.label || "VIEW LINK"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <section id={sectionId} className="py-16 sm:py-24 border-b border-[#111111] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number={numberStr}
          category={getCategoryLabel(section.type)}
          title={section.title}
          count={entries.length}
        />

        {/* 1. EXPERIENCE TYPE */}
        {section.type === "experience" && (
          <div className="divide-y divide-[#111111] border-y border-[#111111]">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 items-start group"
              >
                <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-2">
                  <span className="text-xs font-mono font-bold tracking-swiss text-[#555555]">
                    / {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  {entry.date_range && (
                    <span className="text-xs uppercase font-mono tracking-widest text-[#111111] font-semibold">
                      {entry.date_range}
                    </span>
                  )}
                </div>

                <div className="md:col-span-6 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-swiss text-[#555555]">
                      {entry.subtitle}
                    </p>
                  )}
                  {entry.description && (
                    <p className="text-sm sm:text-base text-[#333333] leading-relaxed pt-2">
                      {entry.description}
                    </p>
                  )}

                  {getEntryLinks(entry).length > 0 && (
                    <div className="pt-2">
                      {renderLinksRow(entry, "")}
                    </div>
                  )}
                </div>

                <div className="md:col-span-3 flex flex-wrap gap-1.5 md:justify-end mt-2 md:mt-0">
                  {entry.tags?.map((tag) => (
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
        )}

        {/* 2. PROJECT TYPE */}
        {section.type === "project" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#111111]">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="border-r border-b border-[#111111] p-6 sm:p-8 flex flex-col justify-between hover:bg-[#EFECE6] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#111111]/30">
                    <span className="text-xs font-mono font-bold tracking-swiss text-[#555555]">
                      [PROJ-{(idx + 1).toString().padStart(2, "0")}]
                    </span>
                    {entry.date_range && (
                      <span className="text-xs font-mono text-[#555555]">{entry.date_range}</span>
                    )}
                  </div>

                  {entry.subtitle && (
                    <span className="text-[10px] font-bold uppercase tracking-swiss text-[#555555] block mb-2">
                      {entry.subtitle}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                    {entry.title}
                  </h3>

                  {entry.description && (
                    <p className="text-sm text-[#333333] leading-relaxed mb-6">
                      {entry.description}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {entry.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase tracking-swiss font-mono px-2 py-0.5 border border-[#111111] text-[#111111]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {renderLinksRow(entry, "INTERNAL ARCHIVE")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. APP TYPE */}
        {section.type === "app" && (
          <div className="space-y-6">
            {entries.map((entry, idx) => {
              const links = getEntryLinks(entry);
              return (
                <div
                  key={entry.id}
                  className="border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8 relative hover:bg-[#EFECE6] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#111111]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#111111] text-[#F5F4F0] flex items-center justify-center">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-mono font-bold tracking-swiss text-[#111111]">
                        SYS.APP-{(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#111111] bg-[#F5F4F0] text-[#111111]">
                        {entry.subtitle || "INTERACTIVE UTILITY"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-[#555555]">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>STATUS: OPERATIONAL</span>
                      </span>
                      {entry.date_range && <span>RELEASE: {entry.date_range}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                      <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-[#111111] mb-3">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="text-sm sm:text-base text-[#333333] leading-relaxed max-w-3xl">
                          {entry.description}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end gap-4 h-full">
                      <div className="flex flex-wrap gap-1.5 lg:justify-end">
                        {entry.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase font-mono tracking-swiss px-2 py-1 bg-[#111111] text-[#F5F4F0]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {links.length > 0 && (
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          {links.map((linkItem, lIdx) => (
                            <a
                              key={lIdx}
                              href={linkItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-swiss text-[#111111] border border-[#111111] px-3 py-1.5 hover:bg-[#111111] hover:text-[#F5F4F0] transition-colors"
                            >
                              <span>{linkItem.label || "LAUNCH APP"}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. AWARD TYPE */}
        {section.type === "award" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-[#111111] bg-[#F5F4F0]">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#111111] divide-y divide-[#111111]">
              <div className="p-4 bg-[#111111] text-[#F5F4F0] flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-swiss font-bold">
                  SELECT RECOGNITION
                </span>
                <Award className="w-4 h-4" />
              </div>

              {entries.map((award, idx) => {
                const isSelected = award.id === (activeAward?.id || selectedAwardId);
                const isFellowship = award.title.toLowerCase().includes("fellowship");

                return (
                  <button
                    key={award.id}
                    onClick={() => setSelectedAwardId(award.id)}
                    className={`w-full text-left p-4 sm:p-5 flex flex-col gap-1 transition-colors ${
                      isSelected
                        ? "bg-[#111111] text-[#F5F4F0]"
                        : "hover:bg-[#EFECE6] text-[#111111]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono tracking-swiss ${
                          isSelected ? "text-[#CCCCCC]" : "text-[#555555]"
                        }`}
                      >
                        [AWD-{(idx + 1).toString().padStart(2, "0")}] {award.date_range ? `• ${award.date_range}` : ""}
                      </span>
                      {isFellowship && (
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                            isSelected
                              ? "border-[#F5F4F0] text-[#F5F4F0]"
                              : "border-[#111111] bg-[#111111] text-[#F5F4F0]"
                          }`}
                        >
                          FELLOWSHIP
                        </span>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold uppercase tracking-tight">
                      {award.title}
                    </h4>
                    {award.subtitle && (
                      <p
                        className={`text-xs uppercase tracking-swiss ${
                          isSelected ? "text-[#AAAAAA]" : "text-[#555555]"
                        }`}
                      >
                        {award.subtitle}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              {activeAward ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#111111]">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-[#111111]" />
                      <span className="text-xs uppercase font-mono tracking-swiss font-bold text-[#111111]">
                        FEATURED CITATION
                      </span>
                    </div>
                    {activeAward.date_range && (
                      <span className="text-xs font-mono text-[#555555]">
                        YEAR: {activeAward.date_range}
                      </span>
                    )}
                  </div>

                  <div>
                    {activeAward.subtitle && (
                      <span className="text-xs font-bold uppercase tracking-swiss text-[#555555] block mb-2">
                        {activeAward.subtitle}
                      </span>
                    )}
                    <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mb-4">
                      {activeAward.title}
                    </h3>
                    {activeAward.description && (
                      <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                        {activeAward.description}
                      </p>
                    )}
                  </div>

                  {getEntryLinks(activeAward).length > 0 && (
                    <div className="pt-2">
                      {renderLinksRow(activeAward, "")}
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#111111] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {activeAward.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase font-mono tracking-swiss px-2.5 py-1 border border-[#111111] text-[#111111]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-[11px] font-mono text-[#777777] uppercase">
                      ID: {activeAward.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#777777] font-mono">No entries in this section.</p>
              )}
            </div>
          </div>
        )}

        {/* 5. CUSTOM TYPE */}
        {section.type === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#111111]">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="border-r border-b border-[#111111] p-6 sm:p-8 flex flex-col justify-between hover:bg-[#EFECE6] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#111111]/30">
                    <span className="text-xs font-mono font-bold tracking-swiss text-[#555555]">
                      [CUST-{(idx + 1).toString().padStart(2, "0")}]
                    </span>
                    {entry.date_range && (
                      <span className="text-xs font-mono text-[#555555]">{entry.date_range}</span>
                    )}
                  </div>

                  {entry.subtitle && (
                    <span className="text-[10px] font-bold uppercase tracking-swiss text-[#555555] block mb-2">
                      {entry.subtitle}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111] mb-3">
                    {entry.title}
                  </h3>

                  {entry.description && (
                    <p className="text-sm text-[#333333] leading-relaxed mb-6">
                      {entry.description}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {entry.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase tracking-swiss font-mono px-2 py-0.5 border border-[#111111] text-[#111111]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {renderLinksRow(entry, "VISIT RESOURCE")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
