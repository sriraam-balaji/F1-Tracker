'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { 
  getRaceById, 
  getSessionsForRace, 
  getSessionResults, 
  getSessionQualifying, 
  getEventTimeline, 
  getLapTelemetry,
  getDriverById,
  getConstructorById
} from '@/services/f1/selectors';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronLeft, Flag, Cloud, Clock, RefreshCw, BarChart2, Eye, ShieldAlert } from 'lucide-react';

export default function RaceDetailPage() {
  const params = useParams();
  const raceId = params.id as string;
  const [activeTab, setActiveTab] = useState<'standings' | 'qualifying' | 'telemetry' | 'timeline' | 'pitstops'>('standings');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const race = getRaceById(raceId);
  const sessions = getSessionsForRace(raceId);
  
  const raceSession = sessions.find(s => s.type === 'RACE');
  const qualSession = sessions.find(s => s.type === 'QUALIFYING');

  const results = raceSession ? getSessionResults(raceSession.id) : [];
  const qualifying = qualSession ? getSessionQualifying(qualSession.id) : [];
  const events = raceSession ? getEventTimeline(raceSession.id) : [];

  if (!race) {
    return (
      <div className="container" style={{ marginTop: "32px" }}>
        <div className="retro-panel accent-red crt-effect" style={{ textAlign: "center", padding: "48px" }}>
          <h2 style={{ color: "var(--accent-color)", fontSize: "1.5rem", marginBottom: "16px" }}>
            ERROR // RACE_LOG_NOT_FOUND
          </h2>
          <p className="mono text-secondary" style={{ marginBottom: "24px" }}>
            The requested Grand Prix round does not exist in the race database archive.
          </p>
          <Link href="/races" className="retro-btn">
            <ChevronLeft size={16} /> RETURN TO CALENDAR
          </Link>
        </div>
      </div>
    );
  }

  // Pre-select top 3 drivers for telemetry if telemetry is available
  const hasTelemetry = results.some(r => getLapTelemetry(raceSession!.id, r.driverId).length > 0);
  const topDrivers = results.slice(0, 5).map(r => r.driverId);
  
  if (hasTelemetry && selectedDrivers.length === 0) {
    setSelectedDrivers(topDrivers.slice(0, 3));
  }

  // Format telemetry data for Recharts
  // Combined data structure: [{ lap: 1, VER: 74.3, NOR: 74.5 }, ...]
  const chartData: any[] = [];
  if (hasTelemetry && raceSession) {
    const totalLaps = race.laps;
    for (let lap = 1; lap <= totalLaps; lap++) {
      const lapObj: any = { lap };
      selectedDrivers.forEach(driverId => {
        const driver = getDriverById(driverId);
        const laps = getLapTelemetry(raceSession.id, driverId);
        const lapData = laps.find(l => l.lap === lap);
        if (lapData) {
          lapObj[driver ? driver.code : driverId] = lapData.lapTime;
        }
      });
      chartData.push(lapObj);
    }
  }

  // Handle driver toggle for chart
  const toggleDriver = (driverId: string) => {
    if (selectedDrivers.includes(driverId)) {
      if (selectedDrivers.length > 1) {
        setSelectedDrivers(selectedDrivers.filter(id => id !== driverId));
      }
    } else {
      if (selectedDrivers.length < 5) {
        setSelectedDrivers([...selectedDrivers, driverId]);
      }
    }
  };

  const getDriverColor = (code: string) => {
    const colors: Record<string, string> = {
      VER: '#39ff14', // Neon Green
      NOR: '#e10600', // Red
      LEC: '#ffd700', // Gold
      PIA: '#00d2ff', // Cyan
      SAI: '#ff007f', // Pink
      RUS: '#a855f7', // Purple
      HAM: '#fb923c', // Orange
      ANT: '#22c55e', // Green
    };
    return colors[code] || '#f3f4f6';
  };

  return (
    <div className="container" style={{ marginTop: "16px" }}>
      {/* Back button */}
      <div style={{ marginBottom: "16px" }}>
        <Link href="/races" className="retro-btn" style={{ textDecoration: "none" }}>
          <ChevronLeft size={14} /> BACK_TO_CALENDAR
        </Link>
      </div>

      {/* Race Heading Box */}
      <div className="retro-panel accent-red crt-effect" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="mono text-secondary" style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                RND {String(race.round).padStart(2, "0")} // CHAMPIONSHIP_LOG
              </span>
              <span className="led-indicator" />
            </div>
            <h1 style={{ fontSize: "1.8rem", marginTop: "6px" }}>{race.name.toUpperCase()}</h1>
            <p className="mono text-secondary" style={{ marginTop: "4px", fontSize: "0.9rem" }}>
              CIRCUIT: {race.circuit.toUpperCase()} // LOCATION: {race.country.toUpperCase()}
            </p>
          </div>
          
          <div className="mono text-secondary" style={{ fontSize: "0.9rem", textAlign: "right" }}>
            DATE: <strong style={{ color: "#fff" }}>{race.date}</strong><br />
            STATUS: <strong style={{ color: "var(--retro-green)" }}>{race.status.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {/* Quick Race Statistics Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="retro-panel" style={{ padding: "16px" }}>
          <div className="mono text-secondary" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>WINNER</div>
          <div className="led-digit gold" style={{ fontSize: "1.45rem", marginBottom: "4px" }}>
            {race.winner ? race.winner.split(' ').pop()?.toUpperCase() : 'TBD'}
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            LAPS COMPLETED: {race.laps}
          </div>
        </div>

        <div className="retro-panel" style={{ padding: "16px" }}>
          <div className="mono text-secondary" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>WEATHER</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Cloud size={20} color="var(--retro-blue)" />
            <div className="led-digit" style={{ fontSize: "1.45rem", color: "var(--retro-blue)", textShadow: "0 0 4px var(--retro-blue)" }}>
              {race.weather ? race.weather.conditions : 'DRY'}
            </div>
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            AIR: {race.weather?.airTemp || 21}°C // TRACK: {race.weather?.trackTemp || 32}°C
          </div>
        </div>

        <div className="retro-panel" style={{ padding: "16px" }}>
          <div className="mono text-secondary" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>FASTEST LAP</div>
          <div className="led-digit" style={{ fontSize: "1.45rem", color: "var(--retro-green)", textShadow: "0 0 4px var(--retro-green)" }}>
            {race.fastestLap ? race.fastestLap.time : 'TBD'}
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            BY: {race.fastestLap ? getDriverById(race.fastestLap.driverId)?.code : 'N/A'} (LAP {race.fastestLap?.lap})
          </div>
        </div>

        <div className="retro-panel" style={{ padding: "16px" }}>
          <div className="mono text-secondary" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>INCIDENTS</div>
          <div className="led-digit red" style={{ fontSize: "1.45rem", marginBottom: "4px" }}>
            {race.dnfs || 0} DNF // {race.safetyCars || 0} SC
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            RED FLAGS: {race.redFlags || 0}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <button 
          onClick={() => setActiveTab('standings')}
          className={`retro-btn ${activeTab === 'standings' ? 'active' : ''}`}
        >
          RACE_STANDINGS
        </button>
        <button 
          onClick={() => setActiveTab('qualifying')}
          className={`retro-btn ${activeTab === 'qualifying' ? 'active' : ''}`}
        >
          QUALIFYING_GRID
        </button>
        <button 
          onClick={() => setActiveTab('pitstops')}
          className={`retro-btn ${activeTab === 'pitstops' ? 'active' : ''}`}
        >
          PIT_STRATEGY_LOG
        </button>
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`retro-btn ${activeTab === 'timeline' ? 'active' : ''}`}
        >
          RACE_EVENT_FEED
        </button>
        <button 
          onClick={() => setActiveTab('telemetry')}
          className={`retro-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
        >
          LAP_TELEMETRY_CHART
        </button>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="retro-panel crt-effect">
        
        {/* Tab 1: Race Standings */}
        {activeTab === 'standings' && (
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
              Championship Results
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>POS</th>
                    <th style={{ width: "60px" }}>GRID</th>
                    <th style={{ width: "80px" }}>CODE</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th style={{ textAlign: "center" }}>LAPS</th>
                    <th>TIME / GAP</th>
                    <th>TIRE STRATEGY</th>
                    <th style={{ textAlign: "center" }}>PITS</th>
                    <th style={{ textAlign: "right", width: "80px" }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", padding: "24px" }} className="mono text-secondary">
                        NO RESULTS INDEXED FOR THIS ROUND
                      </td>
                    </tr>
                  ) : (
                    results.map((res) => {
                      const driver = getDriverById(res.driverId);
                      const team = getConstructorById(res.constructorId);
                      const delta = res.gridPosition - res.finishPosition;
                      let deltaColor = "var(--text-secondary)";
                      let deltaText = "0";
                      
                      if (delta > 0) {
                        deltaColor = "var(--retro-green)";
                        deltaText = `+${delta}`;
                      } else if (delta < 0) {
                        deltaColor = "var(--accent-color)";
                        deltaText = `${delta}`;
                      }

                      return (
                        <tr key={res.driverId}>
                          <td>
                            <span className="pixel-pos" style={{ color: res.finishPosition === 1 ? 'var(--retro-gold)' : (res.finishPosition === 2 ? '#d1d1d1' : (res.finishPosition === 3 ? '#cd7f32' : 'var(--text-secondary)')) }}>
                              {String(res.finishPosition).padStart(2, "0")}
                            </span>
                          </td>
                          <td className="mono text-secondary">
                            P{res.gridPosition}{' '}
                            <span style={{ color: deltaColor, fontSize: "0.8rem", fontWeight: "bold" }}>
                              ({deltaText})
                            </span>
                          </td>
                          <td className="mono" style={{ fontWeight: "bold", color: "var(--retro-blue)" }}>
                            {driver?.code}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            <Link 
                              href={`/drivers/${res.driverId}`}
                              className="retro-link"
                            >
                              {driver?.name}
                            </Link>
                          </td>
                          <td className="text-secondary">{team?.name}</td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.2rem" }}>
                            {res.lapsCompleted}
                          </td>
                          <td className="mono" style={{ color: res.status === 'DNF' ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                            {res.finishTime}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {res.tireStrategy.map((stint, idx) => (
                                <span key={idx} style={{
                                  fontSize: "0.65rem",
                                  padding: "2px 6px",
                                  border: "1px solid var(--panel-border)",
                                  fontWeight: "bold",
                                  color: stint.compound === 'SOFT' ? 'var(--accent-color)' : (stint.compound === 'MEDIUM' ? 'var(--retro-gold)' : (stint.compound === 'HARD' ? '#fff' : 'var(--retro-blue)')),
                                  fontFamily: "var(--font-pixel-heading)"
                                }}>
                                  {stint.compound[0]}
                                  <span style={{ fontSize: "0.55rem", color: "var(--text-secondary)", marginLeft: "2px" }}>
                                    ({stint.startLap}-{stint.endLap})
                                  </span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ textAlign: "center", fontFamily: "var(--font-pixel-digit)", fontSize: "1.2rem" }}>
                            {res.pitStops.length}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className={`led-digit ${res.points > 0 ? 'green' : ''}`} style={{ fontSize: "1.4rem", color: res.points > 0 ? 'var(--retro-green)' : 'var(--text-secondary)' }}>
                              {res.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Qualifying Grid */}
        {activeTab === 'qualifying' && (
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
              Qualifying Grid Standings
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>POS</th>
                    <th style={{ width: "80px" }}>CODE</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th>Q1 TIME</th>
                    <th>Q2 TIME</th>
                    <th>Q3 TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifying.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "24px" }} className="mono text-secondary">
                        NO QUALIFYING DATA LOGGED FOR THIS GRAND PRIX
                      </td>
                    </tr>
                  ) : (
                    qualifying.map((q) => {
                      const driver = getDriverById(q.driverId);
                      const team = getConstructorById(q.constructorId);

                      return (
                        <tr key={q.driverId}>
                          <td>
                            <span className="pixel-pos" style={{ color: q.position === 1 ? 'var(--retro-gold)' : 'var(--text-secondary)' }}>
                              {String(q.position).padStart(2, "0")}
                            </span>
                          </td>
                          <td className="mono" style={{ fontWeight: "bold", color: "var(--retro-blue)" }}>
                            {driver?.code}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            <Link href={`/drivers/${q.driverId}`} style={{ color: "var(--text-primary)", textDecoration: "none" }}>
                              {driver?.name}
                            </Link>
                          </td>
                          <td className="text-secondary">{team?.name}</td>
                          <td className="mono">{q.q1Time || 'N/A'}</td>
                          <td className="mono">{q.q2Time || '-'}</td>
                          <td className="mono">{q.q3Time || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Pit Strategy Log */}
        {activeTab === 'pitstops' && (
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
              Grand Prix Pit Stop Log
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>LAP</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th style={{ textAlign: "center" }}>TIRE_IN</th>
                    <th style={{ textAlign: "center" }}>&rarr;</th>
                    <th style={{ textAlign: "center" }}>TIRE_OUT</th>
                    <th style={{ textAlign: "right" }}>DURATION</th>
                  </tr>
                </thead>
                <tbody>
                  {results.flatMap(r => r.pitStops.map(p => ({ driverId: r.driverId, constructorId: r.constructorId, stop: p })))
                    .sort((a, b) => a.stop.lap - b.stop.lap)
                    .length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "24px" }} className="mono text-secondary">
                          NO PIT STOPS WERE RECORDED FOR THIS SESSION
                        </td>
                      </tr>
                    ) : (
                      results.flatMap(r => r.pitStops.map(p => ({ driverId: r.driverId, constructorId: r.constructorId, stop: p })))
                        .sort((a, b) => a.stop.lap - b.stop.lap)
                        .map((item, index) => {
                          const driver = getDriverById(item.driverId);
                          const team = getConstructorById(item.constructorId);
                          const stop = item.stop;

                          return (
                            <tr key={index}>
                              <td className="mono" style={{ fontWeight: "bold" }}>LAP {stop.lap}</td>
                              <td style={{ fontWeight: "bold" }}>
                                <Link href={`/drivers/${item.driverId}`} style={{ color: "var(--text-primary)", textDecoration: "none" }}>
                                  {driver?.name}
                                </Link>
                              </td>
                              <td className="text-secondary">{team?.name}</td>
                              <td style={{ textAlign: "center", fontWeight: "bold", color: stop.tireIn === 'SOFT' ? 'var(--accent-color)' : (stop.tireIn === 'MEDIUM' ? 'var(--retro-gold)' : '#fff') }}>
                                {stop.tireIn}
                              </td>
                              <td style={{ textAlign: "center", color: "var(--text-secondary)" }}>&rarr;</td>
                              <td style={{ textAlign: "center", fontWeight: "bold", color: stop.tireOut === 'SOFT' ? 'var(--accent-color)' : (stop.tireOut === 'MEDIUM' ? 'var(--retro-gold)' : '#fff') }}>
                                {stop.tireOut}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <span className="led-digit" style={{ fontSize: "1.45rem" }}>
                                  {stop.duration.toFixed(2)}s
                                </span>
                              </td>
                            </tr>
                          );
                        })
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Race Event Feed */}
        {activeTab === 'timeline' && (
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
              Chronological Event Highlights
            </h2>
            <div style={{ 
              height: "450px", 
              overflowY: "auto", 
              border: "3px solid var(--panel-border)",
              backgroundColor: "#07070a",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              {events.length === 0 ? (
                <div className="mono text-secondary" style={{ textAlign: "center", padding: "48px 0" }}>
                  EVENT LOG IS EMPTY FOR THIS SESSION
                </div>
              ) : (
                events.map((evt, idx) => {
                  let badgeColor = "var(--text-secondary)";
                  let itemBg = "transparent";

                  if (evt.type === 'SAFETY_CAR') {
                    badgeColor = "var(--retro-gold)";
                    itemBg = "rgba(255, 215, 0, 0.05)";
                  } else if (evt.type === 'CRASH') {
                    badgeColor = "var(--accent-color)";
                    itemBg = "rgba(225, 6, 0, 0.05)";
                  } else if (evt.type === 'RAIN_START' || evt.type === 'RAIN_STOP') {
                    badgeColor = "var(--retro-blue)";
                  } else if (evt.type === 'PIT_STOP') {
                    badgeColor = "#fff";
                  }

                  const matchedDriver = evt.driverId ? getDriverById(evt.driverId) : null;

                  return (
                    <div key={idx} style={{ 
                      display: "flex", 
                      gap: "16px", 
                      padding: "10px", 
                      background: itemBg, 
                      borderLeft: `4px solid ${badgeColor}`,
                      borderBottom: "1px dashed rgba(255,255,255,0.05)"
                    }}>
                      <div className="mono" style={{ 
                        fontWeight: "bold", 
                        minWidth: "70px",
                        color: badgeColor
                      }}>
                        LAP {evt.lap}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <span className="mono" style={{ 
                          fontWeight: "bold", 
                          fontSize: "0.75rem",
                          color: badgeColor,
                          border: `1px solid ${badgeColor}`,
                          padding: "1px 6px",
                          marginRight: "10px",
                          fontFamily: "var(--font-pixel-heading)"
                        }}>
                          {evt.type}
                        </span>
                        
                        <span className="mono" style={{ fontSize: "0.95rem", color: "#fff" }}>
                          {evt.details}
                        </span>
                      </div>

                      {matchedDriver && (
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          PILOT: <strong style={{ color: "#fff" }}>{matchedDriver.code}</strong>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Telemetry Line Chart */}
        {activeTab === 'telemetry' && (
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", borderBottom: "4px solid var(--panel-border)", paddingBottom: "12px" }}>
              Driver Pace Telemetry Analysis
            </h2>

            {!hasTelemetry ? (
              <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }} className="mono">
                <ShieldAlert size={48} style={{ color: "var(--retro-gold)", marginBottom: "16px" }} />
                <h3>TELEMETRY_LOGS_EMPTY</h3>
                <p style={{ marginTop: "12px", fontSize: "0.9rem", maxWidth: "600px", margin: "12px auto 0" }}>
                  SATELLITE TELEMETRY FEED FOR LAP-BY-LAP ANALYTICS WAS ONLY INITIATED FOR THE COLD/WET CANADIAN GP (ROUND 7) AND SIMULATED MONACO GP (ROUND 8).
                </p>
              </div>
            ) : (
              <div>
                <p className="mono text-secondary" style={{ fontSize: "0.85rem", marginBottom: "20px" }}>
                  SELECT / DESELECT DRIVERS BELOW TO PLOT THEIR LAP TIMES IN REAL-TIME (LOWER LAP TIME IS FASTER)
                </p>

                {/* Driver select chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
                  {results.slice(0, 10).map((res) => {
                    const driver = getDriverById(res.driverId);
                    if (!driver) return null;
                    const isSelected = selectedDrivers.includes(res.driverId);
                    const color = getDriverColor(driver.code);

                    return (
                      <button
                        key={res.driverId}
                        onClick={() => toggleDriver(res.driverId)}
                        className="retro-btn"
                        style={{
                          fontSize: "0.65rem",
                          padding: "6px 12px",
                          border: `2px solid ${isSelected ? color : 'var(--panel-border)'}`,
                          background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                          color: isSelected ? '#fff' : 'var(--text-secondary)'
                        }}
                      >
                        <span style={{ 
                          display: "inline-block", 
                          width: "8px", 
                          height: "8px", 
                          backgroundColor: color, 
                          marginRight: "6px",
                          boxShadow: `0 0 4px ${color}`
                        }} />
                        {driver.code} (P{res.finishPosition})
                      </button>
                    );
                  })}
                </div>

                {/* Recharts Container */}
                <div style={{ width: "100%", height: "400px", background: "#08080a", border: "3px solid var(--panel-border)", padding: "16px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis 
                        dataKey="lap" 
                        stroke="var(--text-secondary)" 
                        style={{ fontSize: "0.8rem", fontFamily: "var(--font-pixel-body)" }}
                        label={{ value: 'LAP NUMBER', position: 'insideBottomRight', offset: -10, fill: 'var(--text-secondary)' }}
                      />
                      <YAxis 
                        stroke="var(--text-secondary)"
                        style={{ fontSize: "0.8rem", fontFamily: "var(--font-pixel-body)" }}
                        domain={['dataMin - 1', 'dataMax + 1']}
                        label={{ value: 'LAP TIME (S)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)', fontFamily: 'var(--font-pixel-body)' }}
                      />
                      <Legend 
                        wrapperStyle={{ fontFamily: 'var(--font-pixel-body)', fontSize: '0.85rem' }}
                      />
                      {selectedDrivers.map((driverId) => {
                        const driver = getDriverById(driverId);
                        if (!driver) return null;
                        return (
                          <Line
                            key={driverId}
                            type="monotone"
                            dataKey={driver.code}
                            stroke={getDriverColor(driver.code)}
                            activeDot={{ r: 6 }}
                            strokeWidth={3}
                            dot={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
