"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, CircleX, Trash2, Star, FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { DocumentData, useDocuments } from "./DocumentContext";

interface CardProps {
  data: DocumentData;
  reference: React.RefObject<HTMLElement | null>;
}

function getFileIcon(fileType?: string) {
  if (!fileType) return FileText;
  if (fileType.startsWith("image/")) return FileImage;
  if (fileType.includes("spreadsheet") || fileType.includes("excel")) return FileSpreadsheet;
  return FileText;
}

const tagColorBar: Record<string, string> = {
  green: "#16a34a", blue: "#0284c7", purple: "#9333ea", orange: "#ea580c", red: "#dc2626",
};

export default function Card({ data, reference }: CardProps) {
  const { deleteDocument, toggleFavorite } = useDocuments();
  const FileIcon = getFileIcon(data.fileType);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.fileBlob) return alert("No file attached.");
    const url = URL.createObjectURL(data.fileBlob);
    const a = document.createElement("a");
    a.href = url; a.download = data.fileName || "file";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      drag
      dragConstraints={reference}
      dragElastic={0.12}
      dragMomentum={false}
      whileTap={{ cursor: "grabbing" }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      whileHover={{ y: -3 }}
      className="cursor-grab"
    >
      <div
        className="relative w-52 overflow-hidden rounded-[28px] group"
        style={{
          height: "260px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Hover actions */}
        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(data.id); }}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{
              background: data.isFavorite ? "rgba(251,191,36,0.12)" : "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: data.isFavorite ? "#FBBF24" : "var(--color-text-muted)",
            }}
          >
            <Star size={12} fill={data.isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); deleteDocument(data.id); }}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            <Trash2 size={12} />
          </button>
        </div>

        {data.isFavorite && (
          <Star size={12} className="absolute top-5 left-5" style={{ color: "#FBBF24" }} fill="currentColor" />
        )}

        {/* Body */}
        <div className="px-5 pt-6 pb-2">
          <Link href={`/documents/${data.id}`} onClick={e => e.stopPropagation()}>
            <FileIcon size={36} style={{ color: "var(--color-text-muted)" }} className="hover:opacity-70 transition-opacity" />
          </Link>
          <Link href={`/documents/${data.id}`} onClick={e => e.stopPropagation()}>
            <p className="text-[13px] leading-snug mt-3 font-semibold line-clamp-3 hover:opacity-70 transition-opacity" style={{ color: "var(--color-text)" }}>
              {data.description}
            </p>
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          <div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{data.filesize}</span>
            <span
              onClick={data.CloseOrDownload === "Download" ? handleDownload : undefined}
              className="flex h-6 w-6 items-center justify-center rounded-full cursor-pointer transition-colors"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            >
              {data.CloseOrDownload === "Close" ? <CircleX size={13} /> : <Download size={13} />}
            </span>
          </div>

          {data.tag?.isOpen && (
            <div
              className="w-full flex items-center justify-center py-2"
              style={{ background: tagColorBar[data.tag.color ?? "green"] ?? "#16a34a" }}
            >
              <span className="text-[11px] font-semibold text-white">{data.tag.title || data.tagdetails}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}