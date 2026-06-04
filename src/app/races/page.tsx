'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getRacesForSeason } from '@/services/f1/selectors';
import { Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default function RacesPage() {
  const [season, setSeason] = useState<'2026' | '2025'>('2026');

  const races = getRacesForSeason(season === '2026' ? 2026 : 2025);

  const total = races.length;
  const completed = races.filter(r => r.status === 'COMPLETED').length;
  const canceled = races.filter(r => r.status === 'CANCELED').length;
  const upcoming = races.filter(r => r.status === 'UPCOMING').length;

  return (
    <div className="container" style={{ marginTop: "16px" }}>
      {/* Title Panel */}
      <div className="retro-panel crt-effect" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--accent-color)" }}>
          RACE_ARCHIVE_LOG
        </h1>
        <p className="mono text-secondary" style={{ marginTop: "8px", fontSize: "0.9rem" }}>
          SYS.LOG // SCHEDULES, CIRCUITS, AND COMPLETED GRAND PRIX RESULTS
        </p>
      </div>

      {/* Season Selector & Quick Statistics Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "24px", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: "16px" }}>
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

        {/* Calendar stats indicators */}
        <div style={{ display: "flex", gap: "24px", marginLeft: "auto", flexWrap: "wrap" }}>
          <div className="retro-panel" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", minWidth: "120px" }}>
            <span className="led-indicator" />
            <div>
              <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)" }}>COMPLETED</div>
              <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{completed} / {total}</div>
            </div>
          </div>
          {season === '2026' && (
            <div className="retro-panel" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", minWidth: "120px" }}>
              <span className="led-indicator red" />
              <div>
                <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)" }}>CANCELED</div>
                <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{canceled}</div>
              </div>
            </div>
          )}
          <div className="retro-panel" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", minWidth: "120px" }}>
            <span className="led-indicator gold blink" />
            <div>
              <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)" }}>UPCOMING</div>
              <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{upcoming}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar List Panel */}
      <div className="retro-panel crt-effect">
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Calendar size={20} color="var(--accent-color)" />
            <h2 style={{ fontSize: "1.1rem" }}>{season} Calendar & Results</h2>
          </div>
          <span className="mono text-secondary" style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
            TOTAL_ROUNDS: {total}
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ROUND</th>
                <th style={{ width: "140px" }}>DATE</th>
                <th>GRAND PRIX</th>
                <th>CIRCUIT</th>
                <th style={{ width: "160px", textAlign: "center" }}>STATUS</th>
                <th style={{ width: "240px" }}>WINNER</th>
                <th style={{ width: "120px", textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => {
                let statusLabel = "UPCOMING";
                let statusColor = "var(--retro-gold)";
                let statusIcon = <Clock size={16} color="var(--retro-gold)" />;
                let rowOpacity = 1;

                if (race.status === 'COMPLETED') {
                  statusLabel = "COMPLETED";
                  statusColor = "var(--retro-green)";
                  statusIcon = <CheckCircle size={16} color="var(--retro-green)" />;
                } else if (race.status === 'CANCELED') {
                  statusLabel = "CANCELED";
                  statusColor = "var(--accent-color)";
                  statusIcon = <XCircle size={16} color="var(--accent-color)" />;
                  rowOpacity = 0.5;
                }

                return (
                  <tr key={race.id} style={{ opacity: rowOpacity }}>
                    <td>
                      <span className="mono" style={{ fontWeight: "bold" }}>
                        RND {String(race.round).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="mono text-secondary">
                      {race.date}
                    </td>
                    <td style={{ fontWeight: "bold", fontSize: "1.15rem" }}>
                      {race.status !== 'CANCELED' ? (
                        <Link 
                          href={`/races/${race.id}`}
                          className="retro-link"
                        >
                          {race.name}
                        </Link>
                      ) : (
                        <span className="text-secondary">{race.name}</span>
                      )}
                    </td>
                    <td className="text-secondary">
                      {race.circuit}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        color: statusColor, 
                        fontWeight: "bold",
                        fontFamily: "var(--font-pixel-body)",
                        fontSize: "0.9rem"
                      }}>
                        {statusIcon}
                        {statusLabel}
                      </span>
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {race.winner ? (
                        <span style={{ color: "var(--retro-green)" }}>
                          {race.winner.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-secondary" style={{ fontFamily: "var(--font-pixel-heading)", fontSize: "0.65rem" }}>
                          {race.status === 'CANCELED' ? 'N/A' : 'TBD'}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {race.status !== 'CANCELED' ? (
                        <Link href={`/races/${race.id}`} className="retro-btn" style={{ padding: "4px 8px", fontSize: "0.6rem" }}>
                          <Eye size={12} /> DETAILS
                        </Link>
                      ) : (
                        <span className="mono text-secondary" style={{ fontSize: "0.65rem" }}>N/A</span>
                      )}
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
