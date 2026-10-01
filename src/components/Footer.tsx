"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { SocialLink } from "@/types/database";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRight, Globe, Mail } from "lucide-react";

interface FooterProps {
  email: string | null;
  socialLinks: SocialLink[];
  sectionIndex: number;
}

export function Footer({ email, socialLinks, sectionIndex }: FooterProps) {
  const router = useRouter();
  const clickTimestampsRef = useRef<number[]>([]);

  const handleAdminTriggerClick = () => {
    const now = Date.now();
    // Keep only timestamps within the last 1.5 seconds (1500 ms)
    const validTimestamps = [...clickTimestampsRef.current.filter((t) => now - t <= 1500), now];
    clickTimestampsRef.current = validTimestamps;

    if (validTimestamps.length >= 3) {
      clickTimestampsRef.current = [];
      router.push("/admin");
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
    if (p.includes("instagram")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    }
    if (p.includes("email") || p.includes("mail")) {
      return <Mail className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
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
              Open to strategic roles, executive initiatives, and consulting engagements.
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

            <div className="p-4 border border-[#111111] text-xs font-mono text-[#555555] flex flex-wrap items-center justify-between gap-4">
              <span>TIMEZONE: UTC+05:30 (IST)</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#111111] inline-block"></span>
                <span className="text-[#111111] font-bold tracking-wider">ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon & Admin Secret Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-swiss text-[#555555]">
          <div>
            <button
              onClick={handleAdminTriggerClick}
              type="button"
              className="text-[#111111] font-bold hover:opacity-80 focus:outline-none select-none cursor-pointer tracking-wider"
              title="Colophon"
            >
              © tijukjohn
            </button>
            <span className="ml-3 text-[#777777]">ALL RIGHTS RESERVED</span>
          </div>

          <div>
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
