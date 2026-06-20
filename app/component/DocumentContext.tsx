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
  lastViewed?: number;
  isFavorite?: boolean;
  tagdetails: string;
  tag: {
    isOpen: boolean;
    title?: string;
    color?: TagColor;
  };
  fileName?: string;
  fileType?: string;
  fileBlob?: Blob;
}

interface DocumentContextType {
  documents: DocumentData[];
  addDocument: (doc: Omit<DocumentData, "id" | "createdAt">) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Omit<DocumentData, "id" | "createdAt">>) => void;
  toggleFavorite: (id: string) => void;
  markViewed: (id: string) => void;
  isLoading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

localforage.config({
  name: "DocsMiniApp",
  storeName: "documents_store",
});

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      lastViewed: Date.now(),
      isFavorite: false,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id: string, updates: Partial<Omit<DocumentData, "id" | "createdAt">>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const toggleFavorite = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const markViewed = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, lastViewed: Date.now() } : doc
      )
    );
  };

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, deleteDocument, updateDocument, toggleFavorite, markViewed, isLoading }}
    >
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
