import { db } from './db';
import { Driver, Constructor, Race, Session, RaceResult, QualifyingResult, LapTime, RaceEvent, WeatherSnapshot, SeasonDriverStats, SeasonConstructorStats, DriverCareerHistory } from './types';

// ==========================================
// DERIVED METRICS CACHE (Precomputed Layer)
// ==========================================

interface DriverDerivedStats {
  driverId: string;
  season: number;
  averageGrid: number;
  averageFinish: number;
  dnfs: number;
  podiumPercentage: number;
  winPercentage: number;
  placesGained: number; // total places gained relative to grid position
}

interface ConstructorDerivedStats {
  constructorId: string;
  season: number;
  totalPoints: number;
  wins: number;
  podiums: number;
  averageFinish: number;
}

// Caches for derived calculations
const driverDerivedCache: Record<string, DriverDerivedStats> = {}; // key: "driverId_season"
const constructorDerivedCache: Record<string, ConstructorDerivedStats> = {}; // key: "constructorId_season"

// Precompute driver derived stats for a season
function precomputeDriverStats(driverId: string, season: number): DriverDerivedStats {
  const key = `${driverId}_${season}`;
  if (driverDerivedCache[key]) return driverDerivedCache[key];

  // Fetch all completed races in this season
  const seasonRaces = Object.values(db.racesById).filter(r => r.season === season && r.status === 'COMPLETED');
  const standingEntry = db.driverStandingsBySeason[season]?.find(s => s.driverId === driverId);

  let totalGrid = 0;
  let totalFinish = 0;
  let dnfCount = 0;
  let totalPlacesGained = 0;
  let racesParticipated = 0;

  seasonRaces.forEach(race => {
    const sessions = db.sessionsByRaceId[race.id] || [];
    const raceSession = sessions.find(s => s.type === 'RACE');
    if (!raceSession) return;

    const results = db.resultsBySessionId[raceSession.id] || [];
    const result = results.find(r => r.driverId === driverId);
    
    if (result) {
      racesParticipated++;
      totalGrid += result.gridPosition;
      totalFinish += result.finishPosition;
      totalPlacesGained += (result.gridPosition - result.finishPosition);
      if (result.status === 'DNF') {
        dnfCount++;
      }
    }
  });

  const totalRaces = racesParticipated || 1;
  const derived: DriverDerivedStats = {
    driverId,
    season,
    averageGrid: parseFloat((totalGrid / totalRaces).toFixed(1)),
    averageFinish: parseFloat((totalFinish / totalRaces).toFixed(1)),
    dnfs: dnfCount,
    podiumPercentage: standingEntry ? parseFloat(((standingEntry.podiums / totalRaces) * 100).toFixed(0)) : 0,
    winPercentage: standingEntry ? parseFloat(((standingEntry.wins / totalRaces) * 100).toFixed(0)) : 0,
    placesGained: totalPlacesGained,
  };

  driverDerivedCache[key] = derived;
  return derived;
}

// Precompute constructor derived stats for a season
function precomputeConstructorStats(constructorId: string, season: number): ConstructorDerivedStats {
  const key = `${constructorId}_${season}`;
  if (constructorDerivedCache[key]) return constructorDerivedCache[key];

  const standingEntry = db.constructorStandingsBySeason[season]?.find(s => s.constructorId === constructorId);
  const seasonRaces = Object.values(db.racesById).filter(r => r.season === season && r.status === 'COMPLETED');

  let totalFinishPos = 0;
  let resultsCount = 0;

  seasonRaces.forEach(race => {
    const sessions = db.sessionsByRaceId[race.id] || [];
    const raceSession = sessions.find(s => s.type === 'RACE');
    if (!raceSession) return;

    const results = db.resultsBySessionId[raceSession.id] || [];
    const teamResults = results.filter(r => r.constructorId === constructorId);

    teamResults.forEach(res => {
      totalFinishPos += res.finishPosition;
      resultsCount++;
    });
  });

  const derived: ConstructorDerivedStats = {
    constructorId,
    season,
    totalPoints: standingEntry ? standingEntry.points : 0,
    wins: standingEntry ? standingEntry.wins : 0,
    podiums: 0, // calculated from standing entries of drivers
    averageFinish: resultsCount ? parseFloat((totalFinishPos / resultsCount).toFixed(1)) : 0,
  };

  // Aggregate podiums from team drivers in this season
  const seasonStandings = db.driverStandingsBySeason[season] || [];
  const teamStandings = seasonStandings.filter(s => s.constructorId === constructorId);
  let aggregatedPodiums = 0;
  teamStandings.forEach(s => {
    aggregatedPodiums += s.podiums;
  });
  derived.podiums = aggregatedPodiums;

  constructorDerivedCache[key] = derived;
  return derived;
}

// ==========================================
// IMMUTABLE SELECTORS
// ==========================================

// 1. Race Queries
export function getRaceById(raceId: string): Race | undefined {
  return db.racesById[raceId];
}

export function getRacesForSeason(season: number): Race[] {
  return Object.values(db.racesById)
    .filter(r => r.season === season)
    .sort((a, b) => a.round - b.round);
}

// 2. Session Queries
export function getSessionsForRace(raceId: string): Session[] {
  return db.sessionsByRaceId[raceId] || [];
}

export function getSessionResults(sessionId: string): RaceResult[] {
  return db.resultsBySessionId[sessionId] || [];
}

export function getSessionQualifying(sessionId: string): QualifyingResult[] {
  return db.qualifyingBySessionId[sessionId] || [];
}

// 3. Telemetry & Events
export function getLapTelemetry(sessionId: string, driverId: string): LapTime[] {
  const sessionLaps = db.lapTimesBySessionId[sessionId];
  if (!sessionLaps) return [];
  return sessionLaps[driverId] || [];
}

export function getEventTimeline(sessionId: string): RaceEvent[] {
  return db.timelineBySessionId[sessionId] || [];
}

export function getWeatherSnapshot(sessionId: string): WeatherSnapshot | undefined {
  return db.weatherBySessionId[sessionId];
}

// 4. Standings Queries
export function getDriversForSeason(season: number): (Driver & SeasonDriverStats & { teamName: string })[] {
  const standings = db.driverStandingsBySeason[season] || [];
  return standings.map(stat => {
    const driver = db.driversById[stat.driverId];
    const constructor = db.constructorsById[stat.constructorId];
    return {
      ...driver,
      ...stat,
      teamName: constructor ? constructor.name : 'Unknown'
    };
  }).sort((a, b) => a.position - b.position);
}

export function getConstructorsForSeason(season: number): (Constructor & SeasonConstructorStats)[] {
  const standings = db.constructorStandingsBySeason[season] || [];
  return standings.map(stat => {
    const constructor = db.constructorsById[stat.constructorId];
    return {
      ...constructor,
      ...stat
    };
  }).sort((a, b) => a.position - b.position);
}

// 5. Derived Stat Accessors (Pulls from precomputed caches)
export function getDriverSeasonStats(driverId: string, season: number): DriverDerivedStats {
  return precomputeDriverStats(driverId, season);
}

export function getConstructorPerformance(constructorId: string, season: number): ConstructorDerivedStats {
  return precomputeConstructorStats(constructorId, season);
}

export function getPitStopAnalytics(sessionId: string) {
  const results = db.resultsBySessionId[sessionId] || [];
  let totalStops = 0;
  let totalDuration = 0;
  const stopsList: { driverId: string; lap: number; duration: number }[] = [];

  results.forEach(res => {
    res.pitStops.forEach(stop => {
      totalStops++;
      totalDuration += stop.duration;
      stopsList.push({
        driverId: res.driverId,
        lap: stop.lap,
        duration: stop.duration
      });
    });
  });

  const sortedStops = [...stopsList].sort((a, b) => a.duration - b.duration);

  return {
    totalStops,
    averageDuration: totalStops ? parseFloat((totalDuration / totalStops).toFixed(2)) : 0,
    fastestStops: sortedStops.slice(0, 5),
  };
}

// Global data helpers
export function getDriverById(driverId: string): Driver | undefined {
  return db.driversById[driverId];
}

export function getConstructorById(constructorId: string): Constructor | undefined {
  return db.constructorsById[constructorId];
}

export function getDriverCareerHistory(driverId: string): DriverCareerHistory | undefined {
  return db.driverHistoryById[driverId];
}

