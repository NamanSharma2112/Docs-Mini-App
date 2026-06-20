import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./component/theme-provider";
import { DocumentProvider } from "./component/DocumentContext";
import Sidebar from "./component/Sidebar";
import BottomNav from "./component/BottomNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docs — Your Document Hub",
  description: "A beautiful document management app. Upload, organize and access your files.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="antialiased h-full overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
          <Providers>
            <DocumentProvider>

              {/* ── Fixed Top Header ──────────────────── */}
              <header
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  borderBottom: "1px solid var(--color-border)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg btn-brand flex items-center justify-center text-xs font-black text-white">D</div>
                  <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>Docs</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Auth disabled */}
                </div>
              </header>

              {/* ── Layout row below header ─────────────
                  height = 100vh - 56px (header)
                  overflow-hidden so only main scrolls    */}
              <div className="flex overflow-hidden" style={{ height: "calc(100vh - 56px)", marginTop: "56px" }}>
                <Sidebar />

                {/* ONLY this element scrolls — single scrollbar */}
                <main
                  className="flex-1 overflow-y-auto min-w-0"
                  /* pb-28 = 112px — enough room above bottom nav (≈76px) */
                  style={{ paddingBottom: "112px" }}
                >
                  {children}
                </main>
              </div>

              {/* ── Fixed Bottom Nav ────────────────────── */}
              <BottomNav />

            </DocumentProvider>
          </Providers>
      </body>
    </html>
  );
}