"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Files, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useDocuments } from "./DocumentContext";

const navItems = [
  { href: "/",           label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents",  label: "Documents",  icon: Files },
  { href: "/favorites",  label: "Favorites",  icon: Star },
  { href: "/recent",     label: "Recent",     icon: Clock },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { documents } = useDocuments();

  const getBadge = (href: string) => {
    if (href === "/documents") return documents.length || null;
    if (href === "/favorites")  return documents.filter(d => d.isFavorite).length || null;
    return null;
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 208 }}
      transition={{ type: "spring", stiffness: 350, damping: 32 }}
      className="relative flex h-full flex-col py-3 overflow-hidden flex-shrink-0"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const badge = getBadge(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer relative transition-colors"
                style={{
                  background: isActive ? "rgba(249,115,22,0.08)" : "transparent",
                  color: isActive ? "var(--color-brand)" : "var(--color-text-muted)",
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: "var(--color-brand)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon size={17} className="flex-shrink-0" />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="flex flex-1 items-center justify-between overflow-hidden"
                    >
                      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                      {badge !== null && (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold ml-1"
                          style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                        >
                          {badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg mt-1 transition-colors"
        style={{
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          color: "var(--color-text-muted)",
        }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </motion.aside>
  );
}
