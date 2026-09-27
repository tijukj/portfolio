import React from "react";
import { projectData } from "@/lib/placeholder-data";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-16 sm:py-24 border-b border-[#111111] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="02"
          category="SELECTED INITIATIVES & RESEARCH"
          title="PROJECTS"
          count={projectData.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#111111]">
          {projectData.map((project, idx) => (
            <div
              key={project.id}
              className="border-r border-b border-[#111111] p-6 sm:p-8 flex flex-col justify-between hover:bg-[#EFECE6] transition-colors"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#111111]/30">
                  <span className="text-xs font-mono font-bold tracking-swiss text-[#555555]">
                    [PROJ-{(idx + 1).toString().padStart(2, "0")}]
                  </span>
                  <span className="text-xs font-mono text-[#555555]">{project.date}</span>
                </div>

                {project.subtitle && (
                  <span className="text-[10px] font-bold uppercase tracking-swiss text-[#555555] block mb-2">
                    {project.subtitle}
                  </span>
                )}

                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                  {project.title}
                </h3>

                <p className="text-sm text-[#333333] leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase tracking-swiss font-mono px-2 py-0.5 border border-[#111111] text-[#111111]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* External link action */}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-[#111111] text-xs font-bold uppercase tracking-swiss text-[#111111] group"
                  >
                    <span>VIEW CASE STUDY</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <div className="pt-4 border-t border-[#111111] text-xs font-mono text-[#777777] uppercase">
                    INTERNAL RESEARCH
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
