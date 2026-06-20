"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutGrid, Layers, FileText, CircleX, Download, Trash2, Star } from "lucide-react";
import SearchBar from "../component/SearchBar";
import CreateDocModal from "../component/CreateDocModal";
import CanvasBackground from "../component/CanvasBackground";
import Card from "../component/Card";
import { useDocuments, DocumentData } from "../component/DocumentContext";
import Link from "next/link";

// ── Canvas draggable card (light-themed) ────────────────────
function CanvasCard({ data, containerRef }: { data: DocumentData; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { deleteDocument, toggleFavorite } = useDocuments();
  const tagColorBar: Record<string, string> = {
    green: "#16a34a", blue: "#0284c7", purple: "#9333ea", orange: "#ea580c", red: "#dc2626",
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.fileBlob) return;
    const url = URL.createObjectURL(data.fileBlob);
    const a = document.createElement("a"); a.href = url; a.download = data.fileName || "file";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  return (
    <motion.div
      drag dragConstraints={containerRef} dragElastic={0.06} dragMomentum={false}
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileDrag={{ scale: 1.06, zIndex: 99, cursor: "grabbing" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="cursor-grab absolute"
      style={{ left: `${8 + (parseInt(data.id.slice(-2), 16) % 55)}%`, top: `${8 + (parseInt(data.id.slice(-4,-2), 16) % 50)}%` }}
    >
      <div
        className="relative w-48 overflow-hidden rounded-[26px] group shadow-lg"
        style={{ height: "240px", background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className="absolute top-3.5 right-3.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={e => { e.stopPropagation(); toggleFavorite(data.id); }} className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: data.isFavorite ? "#FBBF24" : "var(--color-text-muted)" }}>
            <Star size={10} fill={data.isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={e => { e.stopPropagation(); deleteDocument(data.id); }} className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
            <Trash2 size={10} />
          </button>
        </div>
        {data.isFavorite && <Star size={11} className="absolute top-4 left-4" fill="currentColor" style={{ color: "#FBBF24" }} />}
        <div className="px-4 pt-5 pb-2">
          <Link href={`/documents/${data.id}`} onClick={e => e.stopPropagation()}>
            <FileText size={30} style={{ color: "var(--color-text-muted)" }} />
          </Link>
          <Link href={`/documents/${data.id}`} onClick={e => e.stopPropagation()}>
            <p className="text-[12px] leading-snug mt-2.5 font-semibold line-clamp-3" style={{ color: "var(--color-text)" }}>{data.description}</p>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: "1px solid var(--color-border)" }}>
            <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{data.filesize}</span>
            <span onClick={data.CloseOrDownload === "Download" ? handleDownload : undefined} className="h-5 w-5 flex items-center justify-center rounded-full cursor-pointer" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
              {data.CloseOrDownload === "Close" ? <CircleX size={11} /> : <Download size={11} />}
            </span>
          </div>
          {data.tag?.isOpen && (
            <div className="w-full py-1.5 flex items-center justify-center" style={{ background: tagColorBar[data.tag.color ?? "orange"] }}>
              <span className="text-[10px] font-semibold text-white">{data.tag.title || data.tagdetails}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Documents Page ───────────────────────────────────────────
export default function DocumentsPage() {
  const gridRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { documents } = useDocuments();
  const [view, setView]         = useState<"grid" | "canvas">("grid");
  const [isModalOpen, setModal] = useState(false);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("All");

  const filtered = documents.filter(doc => {
    const matchSearch = doc.description.toLowerCase().includes(search.toLowerCase()) ||
      (doc.fileName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = status === "All" || doc.tagdetails === status;
    return matchSearch && matchStatus;
  });

  return (
    /* Full height flex column — no overflow here, layout handles scroll */
    <div className="flex flex-col" style={{ minHeight: "100%" }}>

      {/* Toolbar — sticky at top of scroll area */}
      <div
        className="sticky top-0 z-20 flex flex-wrap items-center gap-3 px-6 py-3"
        style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Documents</h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{documents.length} total</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-xl p-1 gap-0.5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          {([
            { id: "grid",   icon: LayoutGrid, label: "Grid"   },
            { id: "canvas", icon: Layers,     label: "Canvas" },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id} onClick={() => setView(id)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: view === id ? "var(--color-brand)" : "transparent",
                color:      view === id ? "#fff" : "var(--color-text-muted)",
                boxShadow:  view === id ? "0 2px 8px var(--color-brand-glow)" : "none",
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {view === "grid" && (
          <div className="w-full sm:w-auto sm:flex-1 max-w-xs">
            <SearchBar value={search} onChange={setSearch} statusFilter={status} onStatusFilter={setStatus} />
          </div>
        )}
      </div>

      {/* ── GRID VIEW ──────────────────────────────────────── */}
      {view === "grid" && (
        <div ref={gridRef} className="flex-1 p-6">
          <div className="flex flex-wrap gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map(item => (
                <Card key={item.id} data={item} reference={gridRef as React.RefObject<HTMLElement | null>} />
              ))}
            </AnimatePresence>
          </div>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24" style={{ color: "var(--color-text-dim)" }}>
              <FileText size={40} className="mb-3" />
              <p className="text-sm">{search || status !== "All" ? "No matching documents" : "No documents yet — click + to create one"}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* ── CANVAS VIEW ────────────────────────────────────── */}
      {view === "canvas" && (
        /* Fixed-height canvas — does NOT scroll, cards drag freely */
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ background: "var(--color-bg)", minHeight: "500px" }}
        >
          <CanvasBackground fullBleed />
          <AnimatePresence>
            {documents.map(item => (
              <CanvasCard key={item.id} data={item} containerRef={canvasRef as React.RefObject<HTMLDivElement | null>} />
            ))}
          </AnimatePresence>
          {documents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>No documents — switch to Grid view to create one</p>
            </div>
          )}
        </div>
      )}

      {/* FAB — above bottom nav */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
        onClick={() => setModal(true)}
        className="btn-brand fixed z-40 flex items-center justify-center rounded-full shadow-xl animate-glow"
        style={{ bottom: "96px", right: "28px", height: "52px", width: "52px" }}
      >
        <Plus size={24} />
      </motion.button>

      <CreateDocModal isOpen={isModalOpen} onClose={() => setModal(false)} />
    </div>
  );
}
