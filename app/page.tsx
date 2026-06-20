"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Files, Star, Clock, HardDrive, Plus, ArrowRight, FileText, TrendingUp } from "lucide-react";
import { useDocuments } from "./component/DocumentContext";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const tagColorDot: Record<string, string> = {
  green: "#22c55e", blue: "#0ea5e9", purple: "#a855f7", orange: "#f97316", red: "#ef4444",
};

export default function DashboardPage() {
  const { documents } = useDocuments();

  const favCount = documents.filter(d => d.isFavorite).length;
  const recentDocs = [...documents]
    .sort((a, b) => (b.lastViewed ?? b.createdAt) - (a.lastViewed ?? a.createdAt))
    .slice(0, 5);

  const tagBreakdown = documents.reduce<Record<string, number>>((acc, d) => {
    const t = d.tagdetails || "Other";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total Documents", value: documents.length,                                                         icon: Files,      color: "#F97316", bg: "rgba(249,115,22,0.08)"  },
    { label: "Favorites",       value: favCount,                                                                 icon: Star,       color: "#FBBF24", bg: "rgba(251,191,36,0.08)"  },
    { label: "This Week",       value: documents.filter(d => Date.now()-d.createdAt < 7*86400000).length,        icon: TrendingUp, color: "#22C55E", bg: "rgba(34,197,94,0.08)"   },
    { label: "Storage",         value: `${((documents.length * 1.2) | 0) || 0} MB`,                             icon: HardDrive,  color: "#0EA5E9", bg: "rgba(14,165,233,0.08)"  },
  ];

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>Welcome back — here's your overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
              <s.icon size={19} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{s.value}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Documents */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Recent Documents</h2>
            <Link href="/documents" className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--color-brand)" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10" style={{ color: "var(--color-text-dim)" }}>
              <FileText size={36} className="mb-3" />
              <p className="text-sm">No documents yet</p>
              <Link href="/documents" className="mt-4 btn-brand inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
                <Plus size={14} /> Create one
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {recentDocs.map((doc, i) => (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                      <FileText size={15} style={{ color: "var(--color-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>{doc.fileName || doc.description}</p>
                      <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{doc.filesize} · {doc.tagdetails}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.tag?.color && (
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: tagColorDot[doc.tag.color] ?? "#A1A1AA" }} />
                      )}
                      <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>{timeAgo(doc.lastViewed ?? doc.createdAt)}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Tag breakdown */}
          <div className="rounded-2xl p-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>By Status</h2>
            {Object.keys(tagBreakdown).length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "var(--color-text-dim)" }}>No data yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(tagBreakdown).map(([tag, count]) => (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="w-16 text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{tag}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / documents.length) * 100}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--color-brand)" }}
                      />
                    </div>
                    <span className="text-xs w-3 text-right" style={{ color: "var(--color-text-dim)" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl p-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-dim)" }}>Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { href: "/documents", icon: Plus,  label: "New Document",    primary: true },
                { href: "/favorites", icon: Star,  label: "View Favorites",  primary: false },
                { href: "/recent",    icon: Clock, label: "Recent Activity", primary: false },
              ].map(({ href, icon: Icon, label, primary }) => (
                <Link key={href} href={href}>
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
                    style={primary
                      ? { background: "rgba(249,115,22,0.08)", color: "var(--color-brand)", border: "1px solid rgba(249,115,22,0.15)" }
                      : { background: "var(--color-surface-2)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }
                    }
                  >
                    <Icon size={15} /> {label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
