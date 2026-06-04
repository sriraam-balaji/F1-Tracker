'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isDashActive = pathname === '/';
  const isDriversActive = pathname.startsWith('/drivers');
  const isRacesActive = pathname.startsWith('/races');

  return (
    <div>
      {/* Checkered flag header strip */}
      <div className="checkered-strip" />
      
      <header>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ 
              fontFamily: "var(--font-pixel-heading)", 
              fontSize: "1.1rem", 
              color: "var(--accent-color)",
              textShadow: "2px 2px 0px #000"
            }}>
              F1_<span style={{ color: "#fff" }}>ARCADE</span>
            </span>
          </Link>
          <nav style={{ display: "flex", gap: "24px" }}>
            <Link 
              href="/" 
              className={`retro-btn ${isDashActive ? 'active' : ''}`} 
              style={{ padding: "8px 12px", textTransform: "uppercase", opacity: isDashActive ? 1 : 0.6 }}
            >
              Dash
            </Link>
            <Link 
              href="/drivers" 
              className={`retro-btn ${isDriversActive ? 'active' : ''}`} 
              style={{ padding: "8px 12px", textTransform: "uppercase", opacity: isDriversActive ? 1 : 0.6 }}
            >
              Drivers
            </Link>
            <Link 
              href="/races" 
              className={`retro-btn ${isRacesActive ? 'active' : ''}`} 
              style={{ padding: "8px 12px", textTransform: "uppercase", opacity: isRacesActive ? 1 : 0.6 }}
            >
              Races
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
