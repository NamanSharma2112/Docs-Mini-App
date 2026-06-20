"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CanvasBackground({ fullBleed = false }: { fullBleed?: boolean }) {
  if (!fullBleed) return null;
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Subtle dot grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--color-border)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Subtle brand glow */}
      <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, var(--color-brand-light), transparent)" }} />

      {/* Watermark */}
      <motion.h1
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none tracking-tighter font-black select-none"
        style={{ color: "rgba(0,0,0,0.04)" }}
      >
        Docs
      </motion.h1>

      {/* Canvas label */}
      <p className="absolute top-5 w-full text-center text-[11px] font-semibold uppercase tracking-[0.3em]"
        style={{ color: "var(--color-text-dim)" }}>
        Canvas · Drag cards freely
      </p>
    </div>
  );
}
