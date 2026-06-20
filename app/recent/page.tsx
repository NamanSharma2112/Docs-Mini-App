"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, FileText, Star } from "lucide-react";
import { useDocuments } from "../component/DocumentContext";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
}
function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
}
function getGroupLabel(ts: number) {
  const diffDays = Math.floor((Date.now() - ts) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return "This Week";
  if (diffDays < 30) return "This Month";
  return "Older";
}

const tagColorDot: Record<string, string> = {
  green:"#22c55e", blue:"#0ea5e9", purple:"#a855f7", orange:"#f97316", red:"#ef4444",
};
const ORDER = ["Today","Yesterday","This Week","This Month","Older"];

export default function RecentPage() {
  const { documents } = useDocuments();
  const sorted = [...documents].sort((a,b) => (b.lastViewed ?? b.createdAt) - (a.lastViewed ?? a.createdAt));

  const groups: Record<string, typeof sorted> = {};
  for (const doc of sorted) {
    const label = getGroupLabel(doc.lastViewed ?? doc.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(doc);
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: "var(--color-text)" }}>
          <Clock size={24} style={{ color: "var(--color-brand)" }} /> Recent
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>Your document activity, most recent first</p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24" style={{ color: "var(--color-text-dim)" }}>
          <Clock size={44} className="mb-3" />
          <p className="text-base font-medium">No activity yet</p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-dim)" }}>Documents you create or view will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {ORDER.map(groupLabel => {
            const items = groups[groupLabel];
            if (!items?.length) return null;
            return (
              <div key={groupLabel}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>{groupLabel}</span>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                  <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>{items.length}</span>
                </div>

                {/* Timeline */}
                <div className="relative flex flex-col gap-2 pl-5">
                  <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "var(--color-border)" }} />

                  {items.map((doc, i) => (
                    <motion.div key={doc.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }} className="relative">
                      {/* Dot */}
                      <div className="absolute -left-[14px] top-4 h-3 w-3 rounded-full" style={{ background: tagColorDot[doc.tag?.color ?? "orange"] ?? "#f97316", border: "2px solid var(--color-bg)" }} />
                      <Link href={`/documents/${doc.id}`}>
                        <div className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors"
                          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "var(--color-surface)")}
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                            <FileText size={16} style={{ color: "var(--color-text-muted)" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{doc.fileName || doc.description}</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>{doc.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <div className="flex items-center gap-1.5">
                              {doc.isFavorite && <Star size={11} fill="#FBBF24" style={{ color: "#FBBF24" }} />}
                              <span className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>{doc.filesize}</span>
                            </div>
                            <span className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                              {formatDate(doc.lastViewed ?? doc.createdAt)} · {formatTime(doc.lastViewed ?? doc.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
