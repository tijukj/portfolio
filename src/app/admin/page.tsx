"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Profile, Section, Entry, EntryLink, SocialLink, SectionType } from "@/types/database";
import {
  User,
  Layers,
  Share2,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  Check,
  AlertCircle,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "sections" | "socials">("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Expanded section state for managing entries
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Modals / forms state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<Section> | null>(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<Entry> & { linksArray: EntryLink[] } | null>(null);

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);

  const [photoUploading, setPhotoUploading] = useState(false);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const safeJson = async <T,>(res: Response): Promise<T | null> => {
    try {
      const text = await res.text();
      return text ? (JSON.parse(text) as T) : null;
    } catch {
      return null;
    }
  };

  // Fetch all admin data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, sectionsRes, socialsRes] = await Promise.all([
        fetch("/api/admin/profile"),
        fetch("/api/admin/sections"),
        fetch("/api/admin/social-links"),
      ]);

      if (profileRes.status === 401 || sectionsRes.status === 401 || socialsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const profileData = await safeJson<{ profile?: Profile }>(profileRes);
      const sectionsData = await safeJson<{ sections?: Section[] }>(sectionsRes);
      const socialsData = await safeJson<{ socialLinks?: SocialLink[] }>(socialsRes);

      if (profileData?.profile) setProfile(profileData.profile);
      if (sectionsData?.sections) setSections(sectionsData.sections);
      if (socialsData?.socialLinks) setSocialLinks(socialsData.socialLinks);
    } catch {
      showNotification("Error loading dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // -------------------------------------------------------------
  // PROFILE HANDLERS
  // -------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await safeJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");
      showNotification("Profile updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving profile";
      showNotification(message, "error");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size must be under 5MB", "error");
      return;
    }

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await safeJson<{ error?: string; url?: string }>(res);
      if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed");

      setProfile({ ...profile, photo_url: data.url });
      showNotification("Photo uploaded! Click Save Profile to apply.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      showNotification(message, "error");
    } finally {
      setPhotoUploading(false);
    }
  };

  // -------------------------------------------------------------
  // SECTIONS HANDLERS
  // -------------------------------------------------------------
  const handleToggleSectionVisibility = async (section: Section) => {
    try {
      const updatedVisible = !section.visible;
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section.id, visible: updatedVisible }),
      });
      if (!res.ok) throw new Error("Failed to toggle visibility");

      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, visible: updatedVisible } : s))
      );
      showNotification(`Section "${section.title}" is now ${updatedVisible ? "visible" : "hidden"}`);
    } catch {
      showNotification("Error updating section visibility", "error");
    }
  };

  const handleReorderSections = async (direction: "up" | "down", index: number) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);

    try {
      const orderedIds = newSections.map((s) => s.id);
      const res = await fetch("/api/admin/sections/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder sections");
      showNotification("Sections reordered successfully!");
    } catch {
      showNotification("Error saving section order", "error");
      fetchData();
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection?.title) return;

    try {
      if (editingSection.id) {
        // Update existing
        const res = await fetch("/api/admin/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSection),
        });
        if (!res.ok) throw new Error("Failed to update section");
        showNotification("Section updated!");
      } else {
        // Create new
        const res = await fetch("/api/admin/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSection),
        });
        if (!res.ok) throw new Error("Failed to create section");
        showNotification("Section created!");
      }

      setIsSectionModalOpen(false);
      setEditingSection(null);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving section";
      showNotification(message, "error");
    }
  };

  const handleDeleteSection = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the section "${title}" and all its entries?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete section");
      showNotification(`Section "${title}" deleted.`);
      fetchData();
    } catch {
      showNotification("Error deleting section", "error");
    }
  };

  // -------------------------------------------------------------
  // ENTRIES HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewEntryModal = (sectionId: string) => {
    setEditingEntry({
      section_id: sectionId,
      title: "",
      subtitle: "",
      date_range: "",
      description: "",
      tags: [],
      linksArray: [{ label: "", url: "" }],
    });
    setIsEntryModalOpen(true);
  };

  const handleOpenEditEntryModal = (entry: Entry) => {
    const rawLinks =
      entry.links && Array.isArray(entry.links) && entry.links.length > 0
        ? entry.links
        : entry.link
        ? [{ label: "View Resource", url: entry.link }]
        : [{ label: "", url: "" }];

    setEditingEntry({
      ...entry,
      linksArray: rawLinks,
    });
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry?.title || !editingEntry?.section_id) return;

    try {
      const cleanedLinks = (editingEntry.linksArray || []).filter(
        (l) => l.url && l.url.trim() !== ""
      );

      const payload = {
        ...editingEntry,
        links: cleanedLinks,
      };

      if (editingEntry.id) {
        const res = await fetch("/api/admin/entries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update entry");
        showNotification("Entry updated!");
      } else {
        const res = await fetch("/api/admin/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create entry");
        showNotification("Entry created!");
      }

      setIsEntryModalOpen(false);
      setEditingEntry(null);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving entry";
      showNotification(message, "error");
    }
  };

  const handleDeleteEntry = async (id: string, title: string) => {
    if (!window.confirm(`Delete entry "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/entries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      showNotification(`Entry "${title}" deleted.`);
      fetchData();
    } catch {
      showNotification("Error deleting entry", "error");
    }
  };

  const handleReorderEntries = async (
    sectionId: string,
    direction: "up" | "down",
    index: number
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || !section.entries) return;

    const entries = [...section.entries];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === entries.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const [moved] = entries.splice(index, 1);
    entries.splice(targetIndex, 0, moved);

    // Update state immediately
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, entries } : s))
    );

    try {
      const orderedIds = entries.map((e) => e.id);
      const res = await fetch("/api/admin/entries/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder entries");
      showNotification("Entries reordered!");
    } catch {
      showNotification("Error reordering entries", "error");
      fetchData();
    }
  };

  // -------------------------------------------------------------
  // SOCIAL LINKS HANDLERS
  // -------------------------------------------------------------
  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial?.platform || !editingSocial?.url) return;

    try {
      if (editingSocial.id) {
        const res = await fetch("/api/admin/social-links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSocial),
        });
        if (!res.ok) throw new Error("Failed to update social link");
        showNotification("Social link updated!");
      } else {
        const res = await fetch("/api/admin/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSocial),
        });
        if (!res.ok) throw new Error("Failed to create social link");
        showNotification("Social link created!");
      }

      setIsSocialModalOpen(false);
      setEditingSocial(null);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving social link";
      showNotification(message, "error");
    }
  };

  const handleDeleteSocial = async (id: string, platform: string) => {
    if (!window.confirm(`Delete ${platform} link?`)) return;

    try {
      const res = await fetch(`/api/admin/social-links?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete social link");
      showNotification(`${platform} link deleted.`);
      fetchData();
    } catch {
      showNotification("Error deleting social link", "error");
    }
  };

  const handleReorderSocials = async (direction: "up" | "down", index: number) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === socialLinks.length - 1)
    ) {
      return;
    }

    const newSocials = [...socialLinks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const [moved] = newSocials.splice(index, 1);
    newSocials.splice(targetIndex, 0, moved);

    setSocialLinks(newSocials);

    try {
      const orderedIds = newSocials.map((s) => s.id);
      const res = await fetch("/api/admin/social-links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder social links");
      showNotification("Social links reordered!");
    } catch {
      showNotification("Error reordering social links", "error");
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F5F4F0] font-mono text-xs uppercase tracking-swiss text-[#111111]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#111111] animate-ping"></div>
          <span>INITIALIZING ADMIN_SYS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0] text-[#111111]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#F5F4F0] border-b border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-swiss uppercase text-[#111111]">
                PORTFOLIO CMS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-[#111111] bg-[#111111] text-[#F5F4F0] uppercase">
                ADMIN
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-swiss text-[#111111] hover:underline"
              >
                <span>VIEW LIVE SITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-swiss text-[#555555] hover:text-[#111111] transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 border border-[#111111] shadow-none flex items-center gap-3 text-xs font-mono uppercase tracking-swiss ${
            notification.type === "success"
              ? "bg-[#111111] text-[#F5F4F0]"
              : "bg-[#EAE7DF] text-[#111111]"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 text-[#F5F4F0]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#111111]" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#111111] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 py-3 px-6 text-xs uppercase font-mono tracking-swiss font-bold border-b-2 -mb-[1px] transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "border-[#111111] text-[#111111] bg-[#EAE7DF]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>01 / PROFILE</span>
          </button>

          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center gap-2 py-3 px-6 text-xs uppercase font-mono tracking-swiss font-bold border-b-2 -mb-[1px] transition-all whitespace-nowrap ${
              activeTab === "sections"
                ? "border-[#111111] text-[#111111] bg-[#EAE7DF]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>02 / SECTIONS & ENTRIES ({sections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("socials")}
            className={`flex items-center gap-2 py-3 px-6 text-xs uppercase font-mono tracking-swiss font-bold border-b-2 -mb-[1px] transition-all whitespace-nowrap ${
              activeTab === "socials"
                ? "border-[#111111] text-[#111111] bg-[#EAE7DF]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>03 / SOCIAL LINKS ({socialLinks.length})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "profile" && profile && (
          <div className="border border-[#111111] bg-[#F5F4F0] p-6 sm:p-10">
            <div className="border-b border-[#111111] pb-4 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
                HERO & PROFILE CONFIGURATION
              </h2>
              <span className="text-xs font-mono text-[#555555]">
                DATABASE ID: {profile.id}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Form: Fields (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-transparent border border-[#111111] text-sm font-bold uppercase focus:outline-none focus:bg-[#EFECE6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2">
                      ROLE TAGLINE *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full px-3 py-2.5 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2">
                      BIO & INTRO STATEMENT *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={profile.intro}
                      onChange={(e) => setProfile({ ...profile, intro: e.target.value })}
                      className="w-full px-3 py-2.5 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2">
                        DIRECT CONTACT EMAIL
                      </label>
                      <input
                        type="email"
                        value={profile.email || ""}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2">
                        LOCATION
                      </label>
                      <input
                        type="text"
                        value={profile.location || ""}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="e.g. Kochi / Bengaluru, India"
                        className="w-full px-3 py-2.5 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Form: Portrait Photo (4 cols) */}
                <div className="lg:col-span-4 border border-[#111111] p-4 bg-[#EAE7DF]">
                  <span className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-3">
                    PORTRAIT IMAGE
                  </span>

                  <div className="relative aspect-[3/4] w-full border border-[#111111] bg-[#F5F4F0] mb-4 flex items-center justify-center overflow-hidden">
                    {profile.photo_url ? (
                      <Image
                        src={profile.photo_url}
                        alt="Profile Preview"
                        fill
                        className="object-cover filter grayscale contrast-125"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-2xl font-light text-[#777777] block mb-1">+</span>
                        <span className="text-[10px] font-mono text-[#777777] uppercase">
                          NO PHOTO UPLOADED
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="w-full py-2 bg-[#111111] text-[#F5F4F0] text-xs font-mono font-bold uppercase tracking-swiss flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoUploading ? "UPLOADING..." : "UPLOAD NEW PHOTO"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={photoUploading}
                      />
                    </label>

                    {profile.photo_url && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, photo_url: null })}
                        className="w-full py-2 border border-[#111111] text-[#111111] text-xs font-mono font-bold uppercase tracking-swiss hover:bg-[#111111] hover:text-[#F5F4F0] transition-colors"
                      >
                        REMOVE PHOTO
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#111111] flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-8 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss hover:opacity-90 transition-opacity"
                >
                  SAVE PROFILE CHANGES
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SECTIONS & ENTRIES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#111111]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
                  PORTFOLIO SECTIONS
                </h2>
                <p className="text-xs font-mono text-[#555555] uppercase">
                  MANAGE ORDER, VISIBILITY, AND ENTRIES FOR EACH SECTION
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSection({ title: "", type: "custom", visible: true });
                  setIsSectionModalOpen(true);
                }}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD NEW SECTION</span>
              </button>
            </div>

            {/* Sections List */}
            <div className="space-y-4">
              {sections.map((section, sIdx) => {
                const isExpanded = expandedSectionId === section.id;
                const entries = section.entries || [];

                return (
                  <div
                    key={section.id}
                    className={`border border-[#111111] bg-[#F5F4F0] transition-all ${
                      !section.visible ? "opacity-60 bg-[#EAE7DF]" : ""
                    }`}
                  >
                    {/* Section Row Header */}
                    <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#111111]/30">
                      <div className="flex items-center gap-3">
                        {/* Expand toggle */}
                        <button
                          onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                          className="p-1 text-[#111111] hover:bg-[#EAE7DF]"
                          title="Expand entries"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        <span className="text-xs font-mono font-bold text-[#555555]">
                          [{(sIdx + 1).toString().padStart(2, "0")}]
                        </span>

                        <div>
                          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                            {section.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#777777]">
                            <span className="px-1.5 py-0.2 border border-[#111111]/40">
                              TYPE: {section.type}
                            </span>
                            <span>• {entries.length} ENTRIES</span>
                          </div>
                        </div>
                      </div>

                      {/* Section Controls */}
                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <button
                          onClick={() => handleReorderSections("up", sIdx)}
                          disabled={sIdx === 0}
                          className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorderSections("down", sIdx)}
                          disabled={sIdx === sections.length - 1}
                          className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          onClick={() => handleToggleSectionVisibility(section)}
                          className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                          title={section.visible ? "Hide Section" : "Show Section"}
                        >
                          {section.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Section */}
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setIsSectionModalOpen(true);
                          }}
                          className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                          title="Edit Title / Type"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Section */}
                        <button
                          onClick={() => handleDeleteSection(section.id, section.title)}
                          className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Entries Container */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-[#EFECE6]/50 border-t border-[#111111]/30 space-y-4">
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-xs uppercase font-mono tracking-swiss font-bold text-[#555555]">
                            ENTRIES IN &quot;{section.title}&quot;
                          </span>

                          <button
                            onClick={() => handleOpenNewEntryModal(section.id)}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#111111] text-[#F5F4F0] text-[10px] font-bold uppercase tracking-swiss"
                          >
                            <Plus className="w-3 h-3" />
                            <span>ADD ENTRY</span>
                          </button>
                        </div>

                        {entries.length === 0 ? (
                          <div className="p-6 text-center border border-dashed border-[#111111]/40 text-xs font-mono text-[#777777] uppercase">
                            NO ENTRIES IN THIS SECTION YET. CLICK &quot;ADD ENTRY&quot; ABOVE.
                          </div>
                        ) : (
                          <div className="divide-y divide-[#111111]/30 border border-[#111111] bg-[#F5F4F0]">
                            {entries.map((entry, eIdx) => (
                              <div
                                key={entry.id}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EAE7DF] transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-[#555555]">
                                      #{(eIdx + 1).toString().padStart(2, "0")}
                                    </span>
                                    <h4 className="text-sm font-bold uppercase tracking-tight text-[#111111]">
                                      {entry.title}
                                    </h4>
                                    {entry.date_range && (
                                      <span className="text-[10px] font-mono text-[#777777]">
                                        ({entry.date_range})
                                      </span>
                                    )}
                                  </div>

                                  {entry.subtitle && (
                                    <p className="text-xs font-mono text-[#555555]">
                                      {entry.subtitle}
                                    </p>
                                  )}

                                  {/* Links count */}
                                  <div className="flex items-center gap-2 pt-1">
                                    {entry.links && entry.links.length > 0 && (
                                      <span className="text-[9px] font-mono uppercase bg-[#111111] text-[#F5F4F0] px-1.5 py-0.5">
                                        {entry.links.length} LINK(S)
                                      </span>
                                    )}
                                    {entry.tags?.map((t) => (
                                      <span
                                        key={t}
                                        className="text-[9px] font-mono uppercase border border-[#111111] px-1"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <button
                                    onClick={() => handleReorderEntries(section.id, "up", eIdx)}
                                    disabled={eIdx === 0}
                                    className="p-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                                    title="Move Entry Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleReorderEntries(section.id, "down", eIdx)}
                                    disabled={eIdx === entries.length - 1}
                                    className="p-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                                    title="Move Entry Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditEntryModal(entry)}
                                    className="p-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                                    title="Edit Entry"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id, entry.title)}
                                    className="p-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                                    title="Delete Entry"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SOCIAL LINKS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "socials" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#111111]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
                  SOCIAL & NETWORK LINKS
                </h2>
                <p className="text-xs font-mono text-[#555555] uppercase">
                  FOOTER ICONS & PROFILES CONNECTED TO YOUR PORTFOLIO
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSocial({ platform: "LinkedIn", url: "" });
                  setIsSocialModalOpen(true);
                }}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD SOCIAL LINK</span>
              </button>
            </div>

            <div className="divide-y divide-[#111111] border border-[#111111] bg-[#F5F4F0]">
              {socialLinks.map((social, idx) => (
                <div
                  key={social.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EAE7DF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#555555]">
                      [{(idx + 1).toString().padStart(2, "0")}]
                    </span>
                    <div>
                      <h4 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                        {social.platform}
                      </h4>
                      <p className="text-xs font-mono text-[#666666] break-all">
                        {social.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleReorderSocials("up", idx)}
                      disabled={idx === 0}
                      className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorderSocials("down", idx)}
                      disabled={idx === socialLinks.length - 1}
                      className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0] disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSocial(social);
                        setIsSocialModalOpen(true);
                      }}
                      className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                      title="Edit Link"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(social.id, social.platform)}
                      className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ADD/EDIT SECTION */}
      {/* ------------------------------------------------------------- */}
      {isSectionModalOpen && editingSection && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8">
            <div className="border-b border-[#111111] pb-3 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                {editingSection.id ? "EDIT SECTION" : "ADD NEW SECTION"}
              </h3>
              <button
                onClick={() => setIsSectionModalOpen(false)}
                className="text-sm font-mono font-bold text-[#111111] hover:opacity-60"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  SECTION TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.title || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  placeholder="e.g. Publications / Leadership / Custom"
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  SECTION TYPE *
                </label>
                <select
                  value={editingSection.type || "custom"}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      type: e.target.value as SectionType,
                    })
                  }
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                >
                  <option value="custom">custom (Dynamic Grid)</option>
                  <option value="experience">experience (12-Col Tabular)</option>
                  <option value="project">project (Modular Case Studies)</option>
                  <option value="app">app (Technical Utilities)</option>
                  <option value="award">award (Citations / Fellowship)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sec_visible"
                  checked={editingSection.visible ?? true}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, visible: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#111111]"
                />
                <label
                  htmlFor="sec_visible"
                  className="text-xs font-mono uppercase font-bold text-[#111111]"
                >
                  VISIBLE ON PUBLIC WEBSITE
                </label>
              </div>

              <div className="pt-6 border-t border-[#111111] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="py-2.5 px-4 border border-[#111111] text-xs font-bold uppercase tracking-swiss"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss"
                >
                  SAVE SECTION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD/EDIT ENTRY */}
      {/* ------------------------------------------------------------- */}
      {isEntryModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-[#111111] pb-3 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                {editingEntry.id ? "EDIT ENTRY" : "ADD NEW ENTRY"}
              </h3>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="text-sm font-mono font-bold text-[#111111] hover:opacity-60"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={editingEntry.title || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                  placeholder="e.g. Lead Product Strategist / Project Title"
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                    SUBTITLE / ORGANIZATION
                  </label>
                  <input
                    type="text"
                    value={editingEntry.subtitle || ""}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, subtitle: e.target.value })
                    }
                    placeholder="e.g. Google Labs / Government of Kerala"
                    className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                    DATE RANGE / YEAR
                  </label>
                  <input
                    type="text"
                    value={editingEntry.date_range || ""}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, date_range: e.target.value })
                    }
                    placeholder="e.g. 2023 — Present or 2024"
                    className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={editingEntry.description || ""}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, description: e.target.value })
                  }
                  placeholder="Key accomplishments, overview, or context..."
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm focus:outline-none focus:bg-[#EFECE6]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  TAGS (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={(editingEntry.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  placeholder="Operations, Logistics, Strategy"
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                />
              </div>

              {/* Repeatable Links Field */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#111111]/30 mb-3">
                  <span className="text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>LINKS / RESOURCES (REPEATABLE)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingEntry({
                        ...editingEntry,
                        linksArray: [...(editingEntry.linksArray || []), { label: "", url: "" }],
                      })
                    }
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-[#111111] text-[#F5F4F0] px-2 py-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD LINK</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingEntry.linksArray || []).map((linkItem, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. GDrive / GitHub / Demo)"
                        value={linkItem.label}
                        onChange={(e) => {
                          const updated = [...(editingEntry.linksArray || [])];
                          updated[lIdx].label = e.target.value;
                          setEditingEntry({ ...editingEntry, linksArray: updated });
                        }}
                        className="w-1/3 px-2 py-1.5 bg-transparent border border-[#111111] text-xs font-mono"
                      />
                      <input
                        type="url"
                        placeholder="https://example.com/..."
                        value={linkItem.url}
                        onChange={(e) => {
                          const updated = [...(editingEntry.linksArray || [])];
                          updated[lIdx].url = e.target.value;
                          setEditingEntry({ ...editingEntry, linksArray: updated });
                        }}
                        className="w-2/3 px-2 py-1.5 bg-transparent border border-[#111111] text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingEntry.linksArray || [])].filter(
                            (_, idx) => idx !== lIdx
                          );
                          setEditingEntry({ ...editingEntry, linksArray: updated });
                        }}
                        className="p-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F4F0]"
                        title="Remove link"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#111111] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="py-2.5 px-4 border border-[#111111] text-xs font-bold uppercase tracking-swiss"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss"
                >
                  SAVE ENTRY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: ADD/EDIT SOCIAL LINK */}
      {/* ------------------------------------------------------------- */}
      {isSocialModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8">
            <div className="border-b border-[#111111] pb-3 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                {editingSocial.id ? "EDIT SOCIAL LINK" : "ADD SOCIAL LINK"}
              </h3>
              <button
                onClick={() => setIsSocialModalOpen(false)}
                className="text-sm font-mono font-bold text-[#111111] hover:opacity-60"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  PLATFORM *
                </label>
                <select
                  value={editingSocial.platform || "LinkedIn"}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, platform: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="Email">Email</option>
                  <option value="Website">Website</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-1">
                  URL / TARGET *
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.url || ""}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  placeholder="https://linkedin.com/in/... or mailto:..."
                  className="w-full px-3 py-2 bg-transparent border border-[#111111] text-sm font-mono focus:outline-none focus:bg-[#EFECE6]"
                />
              </div>

              <div className="pt-6 border-t border-[#111111] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="py-2.5 px-4 border border-[#111111] text-xs font-bold uppercase tracking-swiss"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss"
                >
                  SAVE LINK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
