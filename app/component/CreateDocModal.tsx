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

export default function CreateDocModal({ isOpen, onClose }: CreateDocModalProps) {
  const { addDocument } = useDocuments();
  
  const [description, setDescription] = useState("");
  const [tagDetails, setTagDetails] = useState("Important");
  const [tagColor, setTagColor] = useState<TagColor>("green");
  const [closeOrDownload, setCloseOrDownload] = useState("Download");
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    // Optionally auto-fill description if it's empty
    if (!description.trim()) {
      setDescription(`Document: ${file.name}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let finalFileSize = "0 KB";
    let fileName = "";
    let fileType = "";
    let fileBlob: Blob | undefined = undefined;

    if (selectedFile) {
      finalFileSize = formatFileSize(selectedFile.size);
      fileName = selectedFile.name;
      fileType = selectedFile.type;
      fileBlob = selectedFile; // Store the actual file blob
    } else {
      // Mock random size if no file selected just for UI purposes, or leave as 0 KB
      finalFileSize = formatFileSize(Math.floor(Math.random() * 5000000) + 100000);
    }

    addDocument({
      description,
      filesize: finalFileSize,
      CloseOrDownload: closeOrDownload,
      tagdetails: tagDetails,
      tag: {
        isOpen: true,
        title: tagDetails,
        color: tagColor,
      },
      fileName,
      fileType,
      fileBlob,
    });

    // Reset and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDescription("");
    setTagDetails("Important");
    setTagColor("green");
    setCloseOrDownload("Download");
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-zinc-900/90 border border-zinc-800 p-8 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-2xl font-semibold text-white">Create Document</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* File Upload Drag & Drop Area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Upload File</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors ${
                    isDragging
                      ? "border-purple-500 bg-purple-500/10"
                      : selectedFile
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center text-center">
                      <FileIcon className="mb-2 text-green-400" size={32} />
                      <span className="text-sm font-medium text-white break-all line-clamp-1">{selectedFile.name}</span>
                      <span className="mt-1 text-xs text-zinc-400">{formatFileSize(selectedFile.size)}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <UploadCloud className={`mb-2 ${isDragging ? 'text-purple-400' : 'text-zinc-400'}`} size={32} />
                      <span className="text-sm font-medium text-white">Click or drag file here</span>
                      <span className="mt-1 text-xs text-zinc-400">PDF, DOCX, Images, etc.</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description..."
                  className="h-20 w-full resize-none rounded-2xl bg-zinc-800 p-4 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">Status</label>
                  <select
                    value={tagDetails}
                    onChange={(e) => setTagDetails(e.target.value)}
                    className="w-full rounded-xl bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="Important">Important</option>
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">Color</label>
                  <select
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value as TagColor)}
                    className="w-full rounded-xl bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-purple-600 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-500 active:scale-[0.98]"
              >
                Create Document
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
