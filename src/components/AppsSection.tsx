import React from "react";
import { appData } from "@/lib/placeholder-data";
import { SectionHeader } from "./SectionHeader";
import { Terminal, ExternalLink, Cpu } from "lucide-react";

export function AppsSection() {
  return (
    <section id="apps" className="py-16 sm:py-24 border-b border-[#111111] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="03"
          category="SOFTWARE, TOOLS & UTILITIES"
          title="APPLICATIONS"
          count={appData.length}
        />

        <div className="space-y-6">
          {appData.map((app, idx) => (
            <div
              key={app.id}
              className="border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8 relative hover:bg-[#EFECE6] transition-colors"
            >
              {/* Technical top bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#111111]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-[#111111] text-[#F5F4F0] flex items-center justify-center">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-swiss text-[#111111]">
                    SYS.APP-{(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#111111] bg-[#F5F4F0] text-[#111111]">
                    {app.subtitle || "INTERACTIVE UTILITY"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#555555]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>STATUS: OPERATIONAL</span>
                  </span>
                  <span>RELEASE: {app.date}</span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-[#111111] mb-3">
                    {app.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#333333] leading-relaxed max-w-3xl">
                    {app.description}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end gap-4 h-full">
                  <div className="flex flex-wrap gap-1.5 lg:justify-end">
                    {app.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-mono tracking-swiss px-2 py-1 bg-[#111111] text-[#F5F4F0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {app.link && (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-swiss text-[#111111] border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F5F4F0] transition-colors"
                    >
                      <span>LAUNCH APP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
