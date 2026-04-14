"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-16" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-16 h-9 rounded-full p-1 transition-colors duration-300
      bg-neutral-200 dark:bg-neutral-800 flex items-center"
    >
      {/* Background glow */}
      <motion.div
        layout
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b, #020617)"
            : "linear-gradient(135deg, #fde68a, #f59e0b)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Sliding Knob */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="relative z-10 h-7 w-7 rounded-full bg-white dark:bg-neutral-900 shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 28 : 0,
        }}
      >
        {/* Icon animation */}
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-white" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}