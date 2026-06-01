"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import localforage from "localforage";

export type TagColor = "green" | "blue" | "red" | "purple" | "orange";

export interface DocumentData {
  id: string;
  description: string;
  filesize: string;
  CloseOrDownload: string;
  createdAt: number;
  tagdetails: string;
  tag: {
    isOpen: boolean;
    title?: string;
    color?: TagColor;
  };
  fileName?: string;
  fileType?: string;
  fileBlob?: Blob; // Storing the actual file Blob
}

interface DocumentContextType {
  documents: DocumentData[];
  addDocument: (doc: Omit<DocumentData, "id" | "createdAt">) => void;
  deleteDocument: (id: string) => void;
  isLoading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Initialize localforage store
localforage.config({
  name: "DocsMiniApp",
  storeName: "documents_store",
});

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await localforage.getItem<DocumentData[]>("mini-docs-v2");
        if (saved && Array.isArray(saved)) {
          setDocuments(saved);
        }
      } catch (e) {
        console.error("Failed to load documents from IndexedDB", e);
      } finally {
        setIsLoaded(true);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to IndexedDB whenever documents change
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem("mini-docs-v2", documents).catch(e => {
        console.error("Failed to save documents to IndexedDB", e);
      });
    }
  }, [documents, isLoaded]);

  const addDocument = (doc: Omit<DocumentData, "id" | "createdAt">) => {
    const newDoc: DocumentData = {
      ...doc,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, deleteDocument, isLoading }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
