"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Files, Star, Clock } from "lucide-react";

const navItems = [
  { href: "/",          label: "Home",    icon: LayoutDashboard },
  { href: "/documents", label: "Docs",    icon: Files },
  { href: "/favorites", label: "Starred", icon: Star },
  { href: "/recent",    label: "Recent",  icon: Clock },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href}>
            <motion.div
              whileTap={{ scale: 0.88 }}
              className="relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 transition-colors select-none"
              style={{ color: isActive ? "var(--color-brand)" : "var(--color-text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.20)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10 text-[10px] font-semibold tracking-wide">{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
