"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, FileText, ArrowRight } from "lucide-react";
import { useDocuments } from "../component/DocumentContext";

function timeAgo(ts: number) {
  const diff = Date.now() - ts, mins = Math.floor(diff/60000);
  if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins/60); if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
}

const tagColorDot: Record<string, string> = {
  green:"#22c55e", blue:"#0ea5e9", purple:"#a855f7", orange:"#f97316", red:"#ef4444",
};

export default function FavoritesPage() {
  const { documents, toggleFavorite } = useDocuments();
  const favorites = documents.filter(d => d.isFavorite);

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: "var(--color-text)" }}>
          <Star size={24} fill="#FBBF24" style={{ color: "#FBBF24" }} /> Favorites
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
          {favorites.length} starred document{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {favorites.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex flex-col items-center justify-center py-24" style={{ color: "var(--color-text-dim)" }}>
            <Star size={44} className="mb-3" />
            <p className="text-base font-medium">No favorites yet</p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-dim)" }}>Star documents to find them quickly here</p>
            <Link href="/documents" className="mt-5 btn-brand inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl">
              Browse Documents <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((doc, i) => (
              <motion.div key={doc.id} layout
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.96 }}
                transition={{ delay: i*0.04 }}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <Link href={`/documents/${doc.id}`} className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                    <FileText size={17} style={{ color: "var(--color-text-muted)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{doc.fileName || doc.description}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>{doc.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                        style={{ background: tagColorDot[doc.tag?.color ?? "orange"] ?? "#f97316" }}>
                        {doc.tagdetails}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>{doc.filesize} · {timeAgo(doc.createdAt)}</span>
                    </div>
                  </div>
                </Link>
                <button onClick={() => toggleFavorite(doc.id)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors"
                  style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.20)", color: "#FBBF24" }}>
                  <Star size={15} fill="currentColor" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
