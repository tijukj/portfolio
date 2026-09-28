import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — Swiss Portfolio CMS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#111111] antialiased selection:bg-[#111111] selection:text-[#F5F4F0]">
      {children}
    </div>
  );
}
