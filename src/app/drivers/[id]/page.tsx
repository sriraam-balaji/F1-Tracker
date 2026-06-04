'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { 
  getDriverById, 
  getDriverCareerHistory, 
  getRacesForSeason, 
  getSessionsForRace, 
  getSessionResults,
  getDriversForSeason
} from '@/services/f1/selectors';
import { Trophy, ChevronLeft, Calendar, Shield, Zap, RefreshCw, BarChart2 } from 'lucide-react';

export default function DriverDetailPage() {
  const params = useParams();
  const driverId = params.id as string;
  const [season, setSeason] = useState<2026 | 2025>(2026);

  const driver = getDriverById(driverId);
  const history = getDriverCareerHistory(driverId);

  if (!driver) {
    return (
      <div className="container" style={{ marginTop: "32px" }}>
        <div className="retro-panel accent-red crt-effect" style={{ textAlign: "center", padding: "48px" }}>
          <h2 style={{ color: "var(--accent-color)", fontSize: "1.5rem", marginBottom: "16px" }}>
            ERROR // DRIVER_NOT_FOUND
          </h2>
          <p className="mono text-secondary" style={{ marginBottom: "24px" }}>
            The requested driver ID does not exist in the database index.
          </p>
          <Link href="/drivers" className="retro-btn">
            <ChevronLeft size={16} /> RETURN TO DATABASE
          </Link>
        </div>
      </div>
    );
  }

  // Fetch performance of driver for the selected season
  const seasonRaces = getRacesForSeason(season);
  const seasonResults = seasonRaces
    .map(race => {
      const sessions = getSessionsForRace(race.id);
      const raceSession = sessions.find(s => s.type === 'RACE');
      if (!raceSession) return null;
      
      const results = getSessionResults(raceSession.id);
      const result = results.find(r => r.driverId === driverId);
      if (!result) return null;
      
      return {
        race,
        result
      };
    })
    .filter((r): r is { race: any; result: any } => r !== null);

  // Fetch driver standing for selected season
  const standingForSeason = getDriversForSeason(season).find(d => d.id === driverId);

  const skills = [
    { name: 'RAW PACE', rating: driver.paceRating, desc: 'Qualifying single-lap speed capability' },
    { name: 'CONSISTENCY', rating: driver.consistency, desc: 'Lap-by-lap pace variation & error reduction' },
    { name: 'TIRE PRESERVATION', rating: driver.tireManagement, desc: 'Thermal degradation prevention factor' },
    { name: 'WET WEATHER DRIVING', rating: driver.wetWeatherSkill, desc: 'Low-grip surface control & damp track performance' }
  ];

  return (
    <div className="container" style={{ marginTop: "16px" }}>
      {/* Back button */}
      <div style={{ marginBottom: "16px" }}>
        <Link href="/drivers" className="retro-btn" style={{ textDecoration: "none" }}>
          <ChevronLeft size={14} /> BACK_TO_DATABASE
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid-dashboard">
        
        {/* Left Column: Driver Header Profile & Bio (8 cols) */}
        <div className="col-span-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Driver Card Panel */}
          <div className="retro-panel accent-red crt-effect" style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              width: "100px",
              height: "100px",
              border: "4px solid var(--panel-border)",
              background: "#1e1e24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
              fontFamily: "var(--font-pixel-heading)",
              fontSize: "2.8rem",
              color: "var(--accent-color)"
            }}>
              {driver.number}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span className="mono text-secondary" style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                  #{driver.number} // PILOT_PROFILE
                </span>
                <span className="led-indicator" />
              </div>
              <h1 style={{ fontSize: "2rem", color: "#fff", marginTop: "4px" }}>
                {driver.name.toUpperCase()}
              </h1>
              <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
                <span className="mono text-secondary">NAT: <strong style={{ color: "#fff" }}>{driver.nationality} ({driver.countryName})</strong></span>
                <span className="mono text-secondary">DOB: <strong style={{ color: "#fff" }}>{driver.dob}</strong></span>
              </div>
            </div>
          </div>

          {/* Biography Panel */}
          <div className="retro-panel crt-effect">
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "8px", color: "var(--retro-blue)" }}>
              BIOGRAPHY_DATA
            </h2>
            <p className="mono" style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
              {history ? history.biography : "No career record or biography matches this driver in the primary index. Database query returned default profile attributes."}
            </p>
          </div>

          {/* Career Standings Log Table */}
          {history && (
            <div className="retro-panel crt-effect">
              <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "8px", color: "var(--retro-gold)" }}>
                CAREER_HISTORICAL_LOG
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>YEAR</th>
                      <th>CONSTRUCTOR_TEAM</th>
                      <th style={{ textAlign: "center" }}>POS</th>
                      <th style={{ textAlign: "center" }}>WINS</th>
                      <th style={{ textAlign: "center" }}>PODIUMS</th>
                      <th style={{ textAlign: "right" }}>POINTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.careerLog.map((log) => {
                      let posColor = "var(--text-primary)";
                      if (log.position === 1) posColor = "var(--retro-gold)";
                      else if (log.position === 2) posColor = "#d1d1d1";
                      else if (log.position === 3) posColor = "#cd7f32";

                      return (
                        <tr key={log.year}>
                          <td className="mono" style={{ fontWeight: "bold" }}>{log.year}</td>
                          <td style={{ fontWeight: 500 }}>{log.team.toUpperCase()}</td>
                          <td style={{ textAlign: "center", fontWeight: "bold", color: posColor }}>
                            {log.position === 1 ? 'WDC' : `${log.position}`}
                          </td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.3rem" }}>{log.wins}</td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.3rem" }}>{log.podiums}</td>
                          <td style={{ textAlign: "right" }}>
                            <span className="led-digit" style={{ fontSize: "1.4rem" }}>{log.points}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Driver Ratings & Season Performance (4 cols) */}
        <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Driver Simulation Ratings / Traits */}
          <div className="retro-panel accent-gold crt-effect">
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "8px", color: "var(--retro-gold)" }}>
              TRAIT_METRICS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>
                    <span className="mono">{skill.name}</span>
                    <span className="led-digit" style={{ fontSize: "1.3rem", color: "var(--retro-green)" }}>{skill.rating}</span>
                  </div>
                  {/* Glowing progress bar */}
                  <div style={{ height: "12px", border: "2px solid var(--panel-border)", background: "#0c0c0e", width: "100%" }}>
                    <div style={{
                      height: "100%",
                      width: `${skill.rating}%`,
                      backgroundColor: "var(--retro-green)",
                      boxShadow: "0 0 6px var(--retro-green)"
                    }} />
                  </div>
                  <div className="mono text-secondary" style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                    {skill.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Stats Box Summary */}
          {history && (
            <div className="retro-panel crt-effect">
              <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "8px", color: "#fff" }}>
                PILOT_STATS_SUMMARY
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                
                <div style={{ borderBottom: "2px dashed var(--panel-border)", paddingBottom: "8px" }}>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>CHAMPIONSHIPS</div>
                  <div className="led-digit gold" style={{ fontSize: "1.8rem", marginTop: "4px" }}>{history.championships}</div>
                </div>
                
                <div style={{ borderBottom: "2px dashed var(--panel-border)", paddingBottom: "8px" }}>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>RACE WINS</div>
                  <div className="led-digit" style={{ fontSize: "1.8rem", marginTop: "4px" }}>{history.wins}</div>
                </div>

                <div style={{ borderBottom: "2px dashed var(--panel-border)", paddingBottom: "8px" }}>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>PODIUMS</div>
                  <div className="led-digit" style={{ fontSize: "1.8rem", marginTop: "4px", color: "var(--retro-blue)", textShadow: "0 0 4px var(--retro-blue)" }}>{history.podiums}</div>
                </div>

                <div style={{ borderBottom: "2px dashed var(--panel-border)", paddingBottom: "8px" }}>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>POLE POSITIONS</div>
                  <div className="led-digit" style={{ fontSize: "1.8rem", marginTop: "4px", color: "var(--retro-green)", textShadow: "0 0 4px var(--retro-green)" }}>{history.poles}</div>
                </div>

                <div>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>ENTRIES</div>
                  <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "bold", marginTop: "4px" }}>{history.entries}</div>
                </div>

                <div>
                  <div className="mono text-secondary" style={{ fontSize: "0.7rem" }}>CAREER POINTS</div>
                  <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "bold", marginTop: "4px" }}>{history.careerPoints}</div>
                </div>

              </div>
            </div>
          )}

          {/* Selected Season performance tracker */}
          <div className="retro-panel crt-effect">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "8px" }}>
              <h2 style={{ fontSize: "0.95rem", color: "var(--retro-blue)" }}>
                SEASON_LOG
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => setSeason(2026)} 
                  className="retro-btn" 
                  style={{ padding: "4px 8px", fontSize: "0.55rem", border: "2px solid var(--panel-border)", background: season === 2026 ? "var(--accent-color)" : "transparent" }}
                >
                  2026
                </button>
                <button 
                  onClick={() => setSeason(2025)} 
                  className="retro-btn" 
                  style={{ padding: "4px 8px", fontSize: "0.55rem", border: "2px solid var(--panel-border)", background: season === 2025 ? "var(--accent-color)" : "transparent" }}
                >
                  2025
                </button>
              </div>
            </div>

            {standingForSeason && (
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "10px", border: "2px dashed var(--panel-border)", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>SEASON TEAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{standingForSeason.teamName.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>STANDING</div>
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>POS {standingForSeason.position} ({standingForSeason.points} PTS)</div>
                </div>
              </div>
            )}

            <div style={{ 
              maxHeight: "260px", 
              overflowY: "auto", 
              border: "3px solid var(--panel-border)", 
              padding: "10px", 
              background: "#08080b",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              {seasonResults.length === 0 ? (
                <div className="mono text-secondary" style={{ textAlign: "center", fontSize: "0.8rem", padding: "16px" }}>
                  NO_RECORDS_AVAILABLE
                </div>
              ) : (
                seasonResults.map(({ race, result }) => {
                  let badgeColor = "var(--text-secondary)";
                  if (result.finishPosition === 1) badgeColor = "var(--retro-gold)";
                  else if (result.finishPosition === 2) badgeColor = "#d1d1d1";
                  else if (result.finishPosition === 3) badgeColor = "#cd7f32";
                  else if (result.finishPosition <= 10 && result.status !== 'DNF') badgeColor = "var(--retro-green)";
                  else if (result.status === 'DNF') badgeColor = "var(--accent-color)";

                  return (
                    <div key={race.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--panel-border)", paddingBottom: "6px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>RND {String(race.round).padStart(2, "0")}</div>
                        <Link href={`/races/${race.id}`} style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "0.85rem", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {race.name.toUpperCase()}
                        </Link>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                        <div className="mono text-secondary" style={{ fontSize: "0.75rem" }}>
                          G: {result.gridPosition} &rarr;
                        </div>
                        <div className="mono" style={{ 
                          fontWeight: "bold", 
                          fontSize: "0.9rem",
                          color: badgeColor,
                          border: `1px solid ${badgeColor}`,
                          padding: "2px 6px",
                          background: "rgba(0,0,0,0.3)",
                          minWidth: "48px",
                          textAlign: "center"
                        }}>
                          {result.status === 'DNF' ? 'DNF' : `P${result.finishPosition}`}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
