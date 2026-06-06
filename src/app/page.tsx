'use client';

import { useState } from "react";
import { getDriversForSeason, getConstructorsForSeason, getRacesForSeason } from "@/services/f1/selectors";
import { Trophy, Shield, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [season, setSeason] = useState<2026 | 2025 | 2023>(2026);

  const topDrivers = getDriversForSeason(season);
  const constructors = getConstructorsForSeason(season);
  const races = getRacesForSeason(season);

  const marqueeTexts = {
    2026: "+++ 2026 F1 SEASON ACTIVE // CURRENT LEADER: KIMI ANTONELLI (MERCEDES) WITH 106 POINTS AND 4 GRAND PRIX VICTORIES +++ MERCEDES LEADS CONSTRUCTORS CHAMPIONSHIP WITH 176 POINTS +++ MONACO GRAND PRIX (ROUND 8) UPCOMING // REIGNING CHAMPION LANDO NORRIS SITS 5TH IN STANDINGS +++ BAHRAIN AND SAUDI GP CANCELED +++",
    2025: "+++ 2025 F1 SEASON ARCHIVE // CHAMPION: LANDO NORRIS (MCLAREN) WINS WDC IN DRAMATIC FINALE // MCLAREN SECURES CONSTRUCTORS CHAMPIONSHIP WITH 833 POINTS // MAX VERSTAPPEN SITS 2ND STANDINGS WITH 421 POINTS +++",
    2023: "+++ 2023 F1 SEASON ARCHIVE // CHAMPION: MAX VERSTAPPEN (RED BULL) DOMINATES WDC WITH 575 POINTS AND 19 GRAND PRIX VICTORIES // RED BULL RACING CLAIMS CONSTRUCTORS CHAMPIONSHIP WITH 860 POINTS +++"
  };

  const quickStats = {
    2026: {
      champLeader: "ANTONELLI",
      champDesc: "MERCEDES // 4 WINS // 106 PTS",
      constLeader: "MERCEDES",
      constDesc: "176 POINTS // 5 WINS",
      seasonStatus: "RND 08 MONACO GP",
      statusDesc: "5 COMPLETED // 2 CANCELED"
    },
    2025: {
      champLeader: "NORRIS",
      champDesc: "MCLAREN // 7 WINS // 423 PTS",
      constLeader: "MCLAREN",
      constDesc: "833 POINTS // 14 WINS",
      seasonStatus: "RND 24 ABU DHABI",
      statusDesc: "24 COMPLETED // 0 CANCELED"
    },
    2023: {
      champLeader: "VERSTAPPEN",
      champDesc: "RED BULL // 19 WINS // 575 PTS",
      constLeader: "RED BULL",
      constDesc: "860 POINTS // 21 WINS",
      seasonStatus: "RND 09 ABU DHABI",
      statusDesc: "9 COMPLETED // 0 CANCELED"
    }
  };

  const stats = quickStats[season];

  return (
    <div>
      {/* Retro Marquee ticker */}
      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeTexts[season]}
        </div>
      </div>

      <div className="container" style={{ marginTop: "32px" }}>
        {/* Title area */}
        <div className="retro-panel crt-effect" style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", color: "var(--accent-color)" }}>
              F1_TELEMETRY_LOG
            </h1>
            <p className="mono text-secondary" style={{ marginTop: "8px", fontSize: "0.9rem" }}>
              YEAR: {season} // STATUS: {season === 2026 ? "SEASON_ACTIVE" : "SEASON_ARCHIVE"} // DATA: {season === 2026 ? "LIVE_FEED" : "HISTORICAL_RECORD"} // SOURCE: MIXED_MOCK_ERGAST
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className={`led-indicator blink ${season === 2026 ? 'gold' : ''}`} />
              <span className="mono" style={{ fontSize: "0.85rem" }}>{season === 2026 ? "LIVE_GRID" : "GRID_LOG"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="led-indicator blink" />
              <span className="mono" style={{ fontSize: "0.85rem" }}>SAT_LINK_EST</span>
            </div>
          </div>
        </div>

        {/* Season Selector */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          <button 
            onClick={() => setSeason(2026)} 
            className={`retro-btn ${season === 2026 ? 'active' : ''}`}
          >
            2026 SEASON (LIVE)
          </button>
          <button 
            onClick={() => setSeason(2025)} 
            className={`retro-btn ${season === 2025 ? 'active' : ''}`}
          >
            2025 SEASON (ARCHIVE)
          </button>
          <button 
            onClick={() => setSeason(2023)} 
            className={`retro-btn ${season === 2023 ? 'active' : ''}`}
          >
            2023 SEASON (ARCHIVE)
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid-dashboard">
          
          {/* Left Column: Driver Standings & Summary */}
          <div className="col-span-8" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Driver Standings Panel */}
            <div className="retro-panel accent-red crt-effect">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Trophy size={20} color="var(--retro-gold)" />
                  <h2 style={{ fontSize: "1.1rem" }}>Driver Leaderboard</h2>
                </div>
                <span className="mono text-secondary" style={{ fontSize: "0.8rem" }}>{season}_STANDINGS</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>POS</th>
                      <th>DRIVER</th>
                      <th>TEAM</th>
                      <th style={{ textAlign: "center" }}>WINS</th>
                      <th style={{ textAlign: "center" }}>PODS</th>
                      <th style={{ textAlign: "right" }}>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDrivers.map((driver) => {
                      let posColor = "var(--text-secondary)";
                      if (driver.position === 1) posColor = "var(--retro-gold)";
                      if (driver.position === 2) posColor = "#d1d1d1"; // Silver
                      if (driver.position === 3) posColor = "#cd7f32"; // Bronze

                      return (
                        <tr key={driver.id}>
                          <td>
                            <span className="pixel-pos" style={{ color: posColor }}>
                              {String(driver.position).padStart(2, "0")}
                            </span>
                          </td>
                          <td style={{ fontWeight: "bold", letterSpacing: "0.05em" }}>
                            <Link
                              href={`/drivers/${driver.id}`}
                              className="retro-link"
                              style={{ fontSize: "1.15rem" }}
                            >
                              {driver.name}
                            </Link>
                            <span className="mono text-secondary" style={{ marginLeft: "8px", fontSize: "0.8rem" }}>
                              #{driver.number}
                            </span>
                          </td>
                          <td className="text-secondary">{driver.teamName}</td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.4rem" }}>
                            {driver.wins}
                          </td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.4rem" }}>
                            {driver.podiums}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className={`led-digit ${driver.position === 1 ? 'gold' : ''}`}>
                              {driver.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Stats Summary Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              <div className="retro-panel" style={{ padding: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)", marginBottom: "12px" }}>
                  {season === 2026 ? "LIVE CHAMP LEADER" : "CHAMPIONSHIP LEADER"}
                </div>
                <div className="led-digit gold" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                  {stats.champLeader}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {stats.champDesc}
                </div>
              </div>

              <div className="retro-panel" style={{ padding: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)", marginBottom: "12px" }}>
                  CONSTRUCTORS LEADER
                </div>
                <div className="led-digit" style={{ fontSize: "1.5rem", marginBottom: "4px", color: "var(--retro-blue)", textShadow: "0 0 4px var(--retro-blue)" }}>
                  {stats.constLeader}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {stats.constDesc}
                </div>
              </div>

              <div className="retro-panel" style={{ padding: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)", marginBottom: "12px" }}>
                  SEASON STATUS
                </div>
                <div className="led-digit red" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                  {stats.seasonStatus}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {stats.statusDesc}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Constructor Standings & Race Archive */}
          <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Constructors Mini */}
            <div className="retro-panel accent-gold crt-effect">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
                <Shield size={20} color="var(--retro-gold)" />
                <h2 style={{ fontSize: "1.1rem" }}>Constructors</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {constructors.slice(0, 5).map((team) => (
                  <div key={team.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px dashed var(--panel-border)", paddingBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="mono" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {team.position}.
                      </span>
                      <span style={{ fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase" }}>{team.name}</span>
                    </div>
                    <span className="led-digit" style={{ fontSize: "1.4rem" }}>{team.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Race Archive CRT */}
            <div className="retro-panel crt-effect" style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
                <Calendar size={20} color="var(--accent-color)" />
                <h2 style={{ fontSize: "1.1rem" }}>{season} Race Log</h2>
              </div>
              <p className="mono text-secondary" style={{ fontSize: "0.75rem", marginBottom: "16px" }}>
                CRT_TERMINAL: SCROLL TO EXPLORE
              </p>
              
              <div style={{ 
                height: "360px", 
                overflowY: "auto", 
                border: "3px solid var(--panel-border)",
                backgroundColor: "#08080b",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}>
                {races.map((race) => {
                  let statusLabel = "";
                  let statusColor = "var(--text-secondary)";
 
                  if (race.status === 'COMPLETED') {
                    statusLabel = `WINNER: ${race.winner?.toUpperCase()}`;
                    statusColor = "var(--retro-green)";
                  } else if (race.status === 'CANCELED') {
                    statusLabel = "CANCELED";
                    statusColor = "var(--accent-color)";
                  } else {
                    statusLabel = "UPCOMING";
                    statusColor = "var(--retro-gold)";
                  }

                  return (
                    <div key={race.id} style={{ 
                      borderBottom: "1px solid var(--panel-border)", 
                      paddingBottom: "10px",
                      fontFamily: "var(--font-pixel-body)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                        <span>RND {String(race.round).padStart(2, "0")}</span>
                        <span>{race.date}</span>
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "0.95rem", textTransform: "uppercase" }}>
                        {race.status !== 'CANCELED' ? (
                          <Link 
                            href={`/races/${race.id}`}
                            className="retro-link-white"
                          >
                            {race.name}
                          </Link>
                        ) : (
                          <span className="text-secondary">{race.name}</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.85rem", marginTop: "4px", color: statusColor, fontWeight: "bold" }}>
                        {statusLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
