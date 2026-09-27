"use client";

import React, { useRef } from "react";
import { SocialLink } from "@/types/database";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRight } from "lucide-react";

interface FooterProps {
  email: string | null;
  socialLinks: SocialLink[];
  sectionIndex: number;
}

export function Footer({ email, socialLinks, sectionIndex }: FooterProps) {
  const clickTimestampsRef = useRef<number[]>([]);

  const handleAdminTriggerClick = () => {
    const now = Date.now();
    // Keep only timestamps within the last 1.5 seconds (1500 ms)
    const validTimestamps = [...clickTimestampsRef.current.filter((t) => now - t <= 1500), now];
    clickTimestampsRef.current = validTimestamps;

    if (validTimestamps.length >= 3) {
      console.log("ADMIN_TRIGGER");
      // Reset after trigger
      clickTimestampsRef.current = [];
    }
  };

  const renderSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("linkedin")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    }
    if (p.includes("github")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
        </svg>
      );
    }
    if (p.includes("twitter") || p.includes("x")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="16" x="2" y="4" rx="0" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  };

  const numberStr = sectionIndex.toString().padStart(2, "0");

  return (
    <footer id="contact" className="pt-16 sm:pt-24 pb-12 bg-[#F5F4F0] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number={numberStr}
          category="DIRECT CHANNELS & COMMUNICATION"
          title="CONTACT"
        />

        {/* Contact info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-[#111111]">
          {/* Col 1-7: Statement and direct email */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]">
              Open to full-time roles, strategic partnerships, and consulting engagements.
            </p>

            {email && (
              <div className="pt-4">
                <span className="text-[10px] uppercase font-mono tracking-swiss text-[#555555] block mb-2">
                  DIRECT INQUIRIES
                </span>
                <a
                  href={`mailto:${email}`}
                  className="inline-block text-2xl sm:text-4xl font-black text-[#111111] hover:underline underline-offset-8 decoration-2 break-all"
                >
                  {email}
                </a>
              </div>
            )}
          </div>

          {/* Col 8-12: Social links row / directory */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-swiss text-[#555555] block mb-3">
                NETWORK & SOCIAL PROFILES
              </span>

              <div className="border-t border-[#111111] divide-y divide-[#111111]">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 flex items-center justify-between group hover:bg-[#EFECE6] px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#111111]">{renderSocialIcon(social.platform)}</span>
                      <span className="text-xs font-bold uppercase tracking-swiss text-[#111111]">
                        {social.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#555555]">
                      <span className="hidden sm:inline">{social.label || social.url.replace(/^https?:\/\//, "")}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-4 border border-[#111111] text-xs font-mono text-[#555555] flex items-center justify-between">
              <span>TIMEZONE: UTC+05:30 (IST)</span>
              <span className="inline-flex items-center gap-1.5 text-[#111111] font-bold">
                <span className="w-2 h-2 bg-[#111111]"></span>
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Colophon & Admin Secret Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-swiss text-[#555555]">
          <div>
            <button
              onClick={handleAdminTriggerClick}
              type="button"
              className="text-[#111111] font-bold hover:opacity-80 focus:outline-none select-none cursor-pointer"
              title="Admin trigger"
            >
              © tijukjohn
            </button>
            <span className="ml-3 text-[#777777]">ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-6">
            <span>HELVETICA / INTER TYPOGRAPHIC GRID</span>
            <a
              href="#"
              className="text-[#111111] font-bold hover:underline"
            >
              TOP ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
