"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statuses = ["All", "Important", "Draft", "Review", "Internal"];

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
}

export default function SearchBar({ value, onChange, statusFilter, onStatusFilter }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-dim)" }} />
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="Search documents..."
          className="w-full rounded-xl py-2.5 pl-9 pr-8 text-sm outline-none transition-colors"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
          onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
        />
        {value && (
          <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-dim)" }}>
            <X size={13} />
          </button>
        )}
      </div>

      <div ref={ref} className="relative flex-shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm transition-colors"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
        >
          {statusFilter}
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              className="absolute right-0 top-11 z-50 w-36 rounded-xl overflow-hidden shadow-xl"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              {statuses.map(s => (
                <button
                  key={s} onClick={() => { onStatusFilter(s); setOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm transition-colors"
                  style={{
                    background: statusFilter === s ? "rgba(249,115,22,0.08)" : "transparent",
                    color: statusFilter === s ? "var(--color-brand)" : "var(--color-text-muted)",
                  }}
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
