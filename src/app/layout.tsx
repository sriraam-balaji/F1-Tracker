import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "F1 ARCADE TRACKER // 2026 STATS",
  description: "8-bit telemetry and historical Formula 1 statistics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          
          <main style={{ flex: 1, padding: "32px 0", backgroundColor: "#0c0c0e" }}>
            {children}
          </main>
          
          <footer style={{ borderTop: "4px solid var(--panel-border)", backgroundColor: "var(--panel-bg)", padding: "16px 0" }}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-body)" }}>
                F1 ARCADE STATS // V1.0.0
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="led-indicator blink" />
                <span style={{ fontSize: "0.8rem", color: "var(--retro-green)", fontFamily: "var(--font-pixel-body)" }}>
                  SYS_ONLINE
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

