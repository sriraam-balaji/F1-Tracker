'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getDriversForSeason } from '@/services/f1/selectors';
import { Trophy, Eye } from 'lucide-react';

export default function DriversPage() {
  const [season, setSeason] = useState<'2026' | '2025'>('2026');

  const drivers = getDriversForSeason(season === '2026' ? 2026 : 2025);
  const maxPoints = Math.max(...drivers.map(d => d.points), 1);

  return (
    <div className="container" style={{ marginTop: "16px" }}>
      {/* Title Panel */}
      <div className="retro-panel crt-effect" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--accent-color)" }}>
          DRIVER_DATABASE
        </h1>
        <p className="mono text-secondary" style={{ marginTop: "8px", fontSize: "0.9rem" }}>
          SYS.REC // EXPLORE PILOT TELEMETRY & CHAMPIONSHIP STANDINGS
        </p>
      </div>

      {/* Season Selector */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <button 
          onClick={() => setSeason('2026')} 
          className={`retro-btn ${season === '2026' ? 'active' : ''}`}
        >
          2026 SEASON (LIVE)
        </button>
        <button 
          onClick={() => setSeason('2025')} 
          className={`retro-btn ${season === '2025' ? 'active' : ''}`}
        >
          2025 SEASON (ARCHIVE)
        </button>
      </div>

      {/* Drivers List Panel */}
      <div className="retro-panel crt-effect">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Trophy size={20} color="var(--retro-gold)" />
            <h2 style={{ fontSize: "1.1rem" }}>{season} Driver Standings</h2>
          </div>
          <span className="mono text-secondary" style={{ fontSize: "0.80rem", marginLeft: "auto" }}>
            DATABASE_QUERY_OK
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>POS</th>
                <th style={{ width: "80px" }}>NUM</th>
                <th style={{ width: "80px" }}>CODE</th>
                <th>DRIVER</th>
                <th>NATIONALITY</th>
                <th>TEAM</th>
                <th style={{ textAlign: "center" }}>WINS</th>
                <th style={{ textAlign: "center" }}>PODS</th>
                <th style={{ width: "200px" }}>POINTS GRAPH</th>
                <th style={{ textAlign: "right" }}>PTS</th>
                <th style={{ width: "100px", textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => {
                let posColor = "var(--text-secondary)";
                if (driver.position === 1) posColor = "var(--retro-gold)";
                if (driver.position === 2) posColor = "#d1d1d1";
                if (driver.position === 3) posColor = "#cd7f32";

                return (
                  <tr key={driver.id} style={{ contentVisibility: "auto" }}>
                    <td>
                      <span className="pixel-pos" style={{ color: posColor }}>
                        {String(driver.position).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="mono text-secondary">
                      #{driver.number}
                    </td>
                    <td className="mono" style={{ fontWeight: "bold", color: "var(--retro-blue)" }}>
                      {driver.code}
                    </td>
                    <td style={{ fontWeight: "bold", fontSize: "1.15rem" }}>
                      <Link 
                        href={`/drivers/${driver.id}`}
                        className="retro-link"
                      >
                        {driver.name}
                      </Link>
                    </td>
                    <td className="mono text-secondary">
                      {driver.nationality}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {driver.teamName}
                    </td>
                    <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.4rem" }}>
                      {driver.wins}
                    </td>
                    <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.4rem" }}>
                      {driver.podiums}
                    </td>
                    <td>
                      {/* Pixelated points progress bar */}
                      <div style={{ display: "flex", alignItems: "center", width: "100%", height: "14px", border: "2px solid var(--panel-border)", background: "#0c0c0e" }}>
                        <div style={{ 
                          height: "100%", 
                          width: `${(driver.points / maxPoints) * 100}%`,
                          backgroundColor: driver.position === 1 ? 'var(--retro-gold)' : 'var(--accent-color)',
                          boxShadow: driver.position === 1 ? '0 0 6px var(--retro-gold)' : '0 0 6px var(--accent-color)'
                        }} />
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`led-digit ${driver.position === 1 ? 'gold' : ''}`}>
                        {driver.points}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Link href={`/drivers/${driver.id}`} className="retro-btn" style={{ padding: "4px 8px", fontSize: "0.6rem" }}>
                        <Eye size={12} /> PROFILE
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
