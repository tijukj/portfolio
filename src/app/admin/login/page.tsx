"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let data: { error?: string; success?: boolean } = {};
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Server returned an invalid response." };
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Check your admin passphrase.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F5F4F0]">
      <div className="w-full max-w-md border border-[#111111] bg-[#F5F4F0] p-6 sm:p-8 shadow-none">
        {/* Top Header */}
        <div className="border-b border-[#111111] pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#111111]" />
            <span className="text-xs uppercase font-mono tracking-swiss font-bold text-[#111111]">
              ADMIN ACCESS
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#555555] uppercase">
            AUTH_SYS V3.0
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111] mb-2">
            AUTHENTICATION
          </h1>
          <p className="text-xs font-mono text-[#555555] uppercase tracking-wider">
            ENTER YOUR ADMIN PASSPHRASE TO MANAGE PORTFOLIO
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-[#111111] bg-[#EFECE6] flex items-start gap-2.5 text-xs text-[#111111]">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase font-mono tracking-swiss font-bold text-[#111111] mb-2"
            >
              ADMIN PASSPHRASE
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              autoFocus
              className="w-full px-3 py-2.5 bg-transparent border border-[#111111] rounded-none text-sm text-[#111111] placeholder-[#888888] focus:outline-none focus:bg-[#EFECE6] font-mono transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111111] text-[#F5F4F0] text-xs font-bold uppercase tracking-swiss flex items-center justify-center gap-2 rounded-none hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            <span>{loading ? "AUTHENTICATING..." : "UNLOCK DASHBOARD"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#111111]/30 flex items-center justify-between text-[10px] font-mono text-[#777777] uppercase">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#111111]" />
            ENCRYPTED SESSION
          </span>
          <a href="/" className="text-[#111111] font-bold hover:underline">
            RETURN TO SITE ↑
          </a>
        </div>
      </div>
    </div>
  );
}
