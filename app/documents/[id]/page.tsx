"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Trash2, Star, Edit3, Check, X, FileText, File as FileIcon, Calendar, HardDrive } from "lucide-react";
import { useDocuments, TagColor } from "../../component/DocumentContext";

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: "12px",
  background: "var(--color-surface-2)", border: "1px solid var(--color-border)",
  padding: "10px 14px", color: "var(--color-text)", outline: "none", fontSize: "14px",
};

const tagColorMap: Record<string, string> = {
  green: "#16a34a", blue: "#0284c7", purple: "#9333ea", orange: "#ea580c", red: "#dc2626",
};
const statuses = ["Important","Draft","Review","Internal"];
const tagColors: TagColor[] = ["green","blue","orange","red"];

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

function FilePreview({ blob, fileType, fileName }: { blob?: Blob; fileType?: string; fileName?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) return;
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  if (!blob || !url) return (
    <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-dim)" }}>
      <FileIcon size={36} className="mb-2" /><p className="text-sm">No file attached</p>
    </div>
  );
  if (fileType?.startsWith("image/")) return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={fileName} className="w-full max-h-96 object-contain" style={{ background: "var(--color-surface-2)" }} />
    </div>
  );
  if (fileType === "application/pdf") return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      <iframe src={url} className="w-full h-96" title={fileName} />
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
      <FileText size={36} className="mb-2" /><p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{fileName}</p>
      <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>Preview not available</p>
    </div>
  );
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { documents, deleteDocument, updateDocument, toggleFavorite, markViewed } = useDocuments();
  const doc = documents.find(d => d.id === params.id);
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc]   = useState("");
  const [editTag, setEditTag]     = useState("");
  const [editColor, setEditColor] = useState<TagColor>("orange");

  useEffect(() => {
    if (doc) { markViewed(doc.id); setEditDesc(doc.description); setEditTag(doc.tagdetails); setEditColor((doc.tag?.color as TagColor) ?? "orange"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]);

  if (!doc) return (
    <div className="flex flex-col items-center justify-center min-h-full p-10" style={{ color: "var(--color-text-dim)" }}>
      <FileText size={44} className="mb-3" /><p className="text-base font-medium">Document not found</p>
      <button onClick={() => router.back()} className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--color-brand)" }}>
        <ArrowLeft size={14} /> Go back
      </button>
    </div>
  );

  const handleSave = () => { updateDocument(doc.id, { description: editDesc, tagdetails: editTag, tag: { ...doc.tag, title: editTag, color: editColor } }); setEditing(false); };
  const handleDownload = () => {
    if (!doc.fileBlob) return alert("No file attached.");
    const url = URL.createObjectURL(doc.fileBlob);
    const a = document.createElement("a"); a.href = url; a.download = doc.fileName || "file";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite(doc.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ border: "1px solid var(--color-border)", background: doc.isFavorite ? "rgba(251,191,36,0.08)" : "var(--color-surface)", color: doc.isFavorite ? "#FBBF24" : "var(--color-text-muted)" }}>
            <Star size={15} fill={doc.isFavorite ? "currentColor" : "none"} />
          </motion.button>
          {doc.fileBlob && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleDownload}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-muted)" }}>
              <Download size={15} />
            </motion.button>
          )}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteDocument(doc.id); router.push("/documents"); }}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626" }}>
            <Trash2 size={15} />
          </motion.button>
        </div>
      </div>

      {/* Main card */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="rounded-3xl p-7 mb-5"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {/* Description + edit */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex-1">
            {editing
              ? <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ ...inputStyle, height: "80px", resize: "none" }} autoFocus />
              : <h1 className="text-xl font-bold leading-snug" style={{ color: "var(--color-text)" }}>{doc.description}</h1>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn-brand flex h-9 w-9 items-center justify-center rounded-xl"><Check size={15} /></button>
                <button onClick={() => setEditing(false)} className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}><X size={15} /></button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                <Edit3 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: HardDrive, label: "File Size", value: doc.filesize },
            { icon: Calendar,  label: "Created",   value: formatDate(doc.createdAt) },
            ...(doc.fileName ? [{ icon: FileIcon, label: "File Name", value: doc.fileName }] : []),
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className={`flex items-start gap-3 rounded-xl p-4 ${label === "File Name" ? "col-span-2" : ""}`}
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <Icon size={15} style={{ color: "var(--color-text-muted)", marginTop: 2 }} />
              <div><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>{value}</p></div>
            </div>
          ))}
        </div>

        {/* Tag section */}
        {editing ? (
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Status</label>
              <select value={editTag} onChange={e => setEditTag(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Color</label>
              <div className="flex gap-2 mt-2">
                {tagColors.map(c => (
                  <button key={c} onClick={() => setEditColor(c)} type="button"
                    className="h-7 w-7 rounded-full transition-transform"
                    style={{ background: tagColorMap[c], transform: editColor === c ? "scale(1.2)" : "scale(1)", outline: editColor === c ? "2px solid #000" : "none", outlineOffset: "2px" }} />
                ))}
              </div></div>
          </div>
        ) : doc.tag?.isOpen && (
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{ background: tagColorMap[doc.tag.color ?? "orange"] }}>
            {doc.tagdetails}
          </span>
        )}
      </motion.div>

      {/* File Preview */}
      <div className="rounded-3xl p-6" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>File Preview</h2>
        <FilePreview blob={doc.fileBlob} fileType={doc.fileType} fileName={doc.fileName} />
      </div>
    </div>
  );
}
