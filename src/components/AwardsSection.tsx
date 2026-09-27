"use client";

import React, { useState } from "react";
import { awardData } from "@/lib/placeholder-data";
import { SectionHeader } from "./SectionHeader";
import { Award, Star } from "lucide-react";

export function AwardsSection() {
  const [selectedAwardId, setSelectedAwardId] = useState<string>(awardData[0]?.id || "");

  const activeAward = awardData.find((a) => a.id === selectedAwardId) || awardData[0];

  return (
    <section id="awards" className="py-16 sm:py-24 border-b border-[#111111] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="04"
          category="HONORS, FELLOWSHIPS & RECOGNITION"
          title="AWARDS"
          count={awardData.length}
        />

        {/* Tabbed / Swiss Index System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-[#111111] bg-[#F5F4F0]">
          {/* Left Column: Awards Selector List / Tabs (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#111111] divide-y divide-[#111111]">
            <div className="p-4 bg-[#111111] text-[#F5F4F0] flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-swiss font-bold">
                SELECT RECOGNITION
              </span>
              <Award className="w-4 h-4" />
            </div>

            {awardData.map((award, idx) => {
              const isSelected = award.id === selectedAwardId;
              const isFellowship = award.title.includes("Young Kerala Fellowship");

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
                      [AWD-0{idx + 1}] • {award.date}
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

          {/* Right Column: Active Award Details (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            {activeAward && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#111111]">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#111111]" />
                    <span className="text-xs uppercase font-mono tracking-swiss font-bold text-[#111111]">
                      FEATURED CITATION
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#555555]">
                    YEAR: {activeAward.date}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-swiss text-[#555555] block mb-2">
                    {activeAward.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mb-4">
                    {activeAward.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                    {activeAward.description}
                  </p>
                </div>

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
                    RECORD ID: {activeAward.id.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
