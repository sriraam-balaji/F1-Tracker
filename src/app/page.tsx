import { getDriversForSeason, getConstructorsForSeason, getRacesForSeason, getSessionsForRace, getSessionResults } from "@/services/f1/selectors";
import { Trophy, Shield, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const topDrivers = getDriversForSeason(2026);
  const constructors = getConstructorsForSeason(2026);
  const races = getRacesForSeason(2026);

  return (
    <div>
      {/* Retro Marquee ticker */}
      <div className="marquee-container">
        <div className="marquee-content">
          +++ 2026 F1 SEASON ACTIVE // CURRENT LEADER: KIMI ANTONELLI (MERCEDES) WITH 131 POINTS AND 4 CONSECUTIVE GRAND PRIX VICTORIES +++ MERCEDES LEADS CONSTRUCTORS CHAMPIONSHIP WITH 219 POINTS +++ MONACO GRAND PRIX (ROUND 8) COMPLETED // REIGNING CHAMPION LANDO NORRIS SITS 5TH IN STANDINGS +++ BAHRAIN AND SAUDI GP CANCELED +++
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
              YEAR: 2026 // STATUS: SEASON_ACTIVE // DATA: LIVE_FEED // SOURCE: MIXED_MOCK_ERGAST
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="led-indicator blink gold" />
              <span className="mono" style={{ fontSize: "0.85rem" }}>LIVE_GRID</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="led-indicator blink" />
              <span className="mono" style={{ fontSize: "0.85rem" }}>SAT_LINK_EST</span>
            </div>
          </div>
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
                <span className="mono text-secondary" style={{ fontSize: "0.8rem" }}>2026_LIVE</span>
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
                  LIVE CHAMP LEADER
                </div>
                <div className="led-digit gold" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                  ANTONELLI
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  MERCEDES // 4 WINS // 131 PTS
                </div>
              </div>

              <div className="retro-panel" style={{ padding: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)", marginBottom: "12px" }}>
                  CONSTRUCTORS LEADER
                </div>
                <div className="led-digit" style={{ fontSize: "1.5rem", marginBottom: "4px", color: "var(--retro-blue)", textShadow: "0 0 4px var(--retro-blue)" }}>
                  MERCEDES
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  219 POINTS // 5 WINS
                </div>
              </div>

              <div className="retro-panel" style={{ padding: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-pixel-heading)", marginBottom: "12px" }}>
                  SEASON STATUS
                </div>
                <div className="led-digit red" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                  RND 08 MONACO GP
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  6 COMPLETED // 2 CANCELED
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
                <h2 style={{ fontSize: "1.1rem" }}>2026 Race Log</h2>
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
