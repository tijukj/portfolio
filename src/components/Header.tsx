"use client";

import React, { useState, useEffect } from "react";
import { Section } from "@/types/database";

interface HeaderProps {
  name: string;
  sections: Section[];
}

export function Header({ name, sections }: HeaderProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sectionElements = document.querySelectorAll("section[id], footer[id]");
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    ...sections.map((s, idx) => ({
      label: s.title.toUpperCase(),
      href: `#${s.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || s.type}`,
      index: (idx + 1).toString().padStart(2, "0"),
    })),
    {
      label: "CONTACT",
      href: "#contact",
      index: (sections.length + 1).toString().padStart(2, "0"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F5F4F0]/95 backdrop-blur-none border-b border-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a
            href="#"
            className="text-xs uppercase tracking-swiss font-bold text-[#111111] hover:opacity-70 transition-opacity"
          >
            {name} <span className="font-normal text-[#555555] ml-2 hidden sm:inline">/ PORTFOLIO</span>
          </a>

          <nav className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8 text-xs uppercase tracking-swiss font-medium overflow-x-auto py-2">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label + item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-all ${
                    isActive
                      ? "text-[#111111] font-bold underline underline-offset-4 decoration-1"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  <span className="text-[10px] text-[#888888] font-mono">{item.index}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="inline sm:hidden">{item.label.slice(0, 3)}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
