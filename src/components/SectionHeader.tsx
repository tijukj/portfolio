import React from "react";

interface SectionHeaderProps {
  number: string;
  title: string;
  category?: string;
  count?: number;
}

export function SectionHeader({ number, title, category, count }: SectionHeaderProps) {
  return (
    <div className="border-b border-[#111111] pb-6 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-[#111111] leading-none select-none">
            {number}
          </span>
          <div className="flex flex-col">
            {category && (
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-swiss text-[#555555] mb-1">
                {category}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#111111]">
              {title}
            </h2>
          </div>
        </div>
        {count !== undefined && (
          <span className="text-xs uppercase tracking-swiss font-mono text-[#555555] sm:self-end">
            [{count.toString().padStart(2, "0")} ENTRIES]
          </span>
        )}
      </div>
    </div>
  );
}
