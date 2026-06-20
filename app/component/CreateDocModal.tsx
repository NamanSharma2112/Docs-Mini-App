"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, File as FileIcon } from "lucide-react";
import { useDocuments, TagColor } from "./DocumentContext";

interface CreateDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  padding: "10px 14px",
  color: "var(--color-text)",
  outline: "none",
  fontSize: "14px",
};

export default function CreateDocModal({ isOpen, onClose }: CreateDocModalProps) {
  const { addDocument } = useDocuments();
  const [description, setDescription]   = useState("");
  const [tagDetails, setTagDetails]     = useState("Important");
  const [tagColor, setTagColor]         = useState<TagColor>("orange");
  const [closeOrDownload, setCloseOrDownload] = useState("Download");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    if (!description.trim()) setDescription(`Document: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    addDocument({
      description,
      filesize: selectedFile ? formatFileSize(selectedFile.size) : formatFileSize(Math.floor(Math.random() * 4000000) + 50000),
      CloseOrDownload: closeOrDownload,
      tagdetails: tagDetails,
      tag: { isOpen: true, title: tagDetails, color: tagColor },
      fileName:  selectedFile?.name,
      fileType:  selectedFile?.type,
      fileBlob:  selectedFile ?? undefined,
    });
    setDescription(""); setTagDetails("Important"); setTagColor("orange");
    setCloseOrDownload("Download"); setSelectedFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-md rounded-3xl p-7 shadow-2xl"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <button onClick={onClose} className="absolute right-6 top-6 transition-opacity hover:opacity-60" style={{ color: "var(--color-text-muted)" }}>
              <X size={20} />
            </button>
            <h2 className="mb-6 text-xl font-bold" style={{ color: "var(--color-text)" }}>Create Document</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* File drop zone */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Upload File</label>
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl py-6 transition-colors"
                  style={{
                    border: `2px dashed ${isDragging ? "var(--color-brand)" : selectedFile ? "#22c55e" : "var(--color-border)"}`,
                    background: isDragging ? "rgba(249,115,22,0.04)" : selectedFile ? "rgba(34,197,94,0.04)" : "var(--color-surface-2)",
                  }}
                >
                  <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && handleFileSelection(e.target.files[0])} className="hidden" />
                  {selectedFile ? (
                    <>
                      <FileIcon size={28} style={{ color: "#22c55e", marginBottom: 8 }} />
                      <span className="text-sm font-medium truncate max-w-[80%]" style={{ color: "var(--color-text)" }}>{selectedFile.name}</span>
                      <span className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{formatFileSize(selectedFile.size)}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={28} style={{ color: isDragging ? "var(--color-brand)" : "var(--color-text-muted)", marginBottom: 8 }} />
                      <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Click or drag file here</span>
                      <span className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>PDF, DOCX, Images, etc.</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Description</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Enter document description..."
                  style={{ ...inputStyle, height: "80px", resize: "none" }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Status</label>
                  <select value={tagDetails} onChange={e => setTagDetails(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    {["Important","Draft","Review","Internal"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Color</label>
                  <select value={tagColor} onChange={e => setTagColor(e.target.value as TagColor)} style={{ ...inputStyle, appearance: "none" }}>
                    {["green","blue","orange","red"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {["Download","Close"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-text-muted)" }}>
                    <input type="radio" name="action" value={opt} checked={closeOrDownload === opt} onChange={() => setCloseOrDownload(opt)} style={{ accentColor: "var(--color-brand)" }} />
                    {opt}
                  </label>
                ))}
              </div>

              <button type="submit" className="btn-brand w-full py-3 text-sm rounded-xl mt-1">
                Create Document
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
