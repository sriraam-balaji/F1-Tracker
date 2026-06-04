import { NormalizedDatastore, Session, RaceResult, QualifyingResult, LapTime, RaceEvent, WeatherSnapshot, SessionType, TireCompound } from './types';
import { mockDrivers } from './data/drivers';
import { mockConstructors } from './data/constructors';
import { driverStandingsBySeason, constructorStandingsBySeason, mockRaces } from './data/seasons';
import { mockDriverHistory } from './data/driver_history';

import { generateRaceTelemetry } from './generators/simulation';
import { monaco2026Seed } from './data/races/monaco_seed';
import { canada2026Seed } from './data/races/canada_seed';

// Initialize database indexes
const sessionsByRaceId: Record<string, Session[]> = {};
const resultsBySessionId: Record<string, RaceResult[]> = {};
const qualifyingBySessionId: Record<string, QualifyingResult[]> = {};
const lapTimesBySessionId: Record<string, Record<string, LapTime[]>> = {};
const timelineBySessionId: Record<string, RaceEvent[]> = {};
const weatherBySessionId: Record<string, WeatherSnapshot> = {};

// 1. Run Monaco Simulation and Hydrate
const monacoSim = generateRaceTelemetry(monaco2026Seed);
mockRaces['race_2026_monaco'] = monacoSim.race;
sessionsByRaceId['race_2026_monaco'] = monacoSim.sessions;
resultsBySessionId['session_monaco_race'] = monacoSim.results;
qualifyingBySessionId['session_monaco_qualifying'] = monacoSim.qualifying;
lapTimesBySessionId['session_monaco_race'] = monacoSim.lapTimes;
timelineBySessionId['session_monaco_race'] = monacoSim.events;
weatherBySessionId['session_monaco_race'] = monacoSim.weather;

// 2. Run Canada Simulation and Hydrate
const canadaSim = generateRaceTelemetry(canada2026Seed);
mockRaces['race_2026_canada'] = canadaSim.race;
sessionsByRaceId['race_2026_canada'] = canadaSim.sessions;
resultsBySessionId['session_canada_race'] = canadaSim.results;
qualifyingBySessionId['session_canada_qualifying'] = canadaSim.qualifying;
lapTimesBySessionId['session_canada_race'] = canadaSim.lapTimes;
timelineBySessionId['session_canada_race'] = canadaSim.events;
weatherBySessionId['session_canada_race'] = canadaSim.weather;

// 3. Auto-generate basic session placeholders and full standings for other completed 2026 / 2025 races
Object.keys(mockRaces).forEach((raceId) => {
  const race = mockRaces[raceId];
  if (raceId === 'race_2026_monaco' || raceId === 'race_2026_canada') return;

  const qualSessionId = `session_${race.season}_${race.id.split('_').pop()}_qualifying`;
  const raceSessionId = `session_${race.season}_${race.id.split('_').pop()}_race`;

  const sList: Session[] = [
    { id: qualSessionId, raceId: raceId, type: SessionType.QUALIFYING, date: race.date, startTime: '16:00' },
    { id: raceSessionId, raceId: raceId, type: SessionType.RACE, date: race.date, startTime: '15:00' },
  ];
  sessionsByRaceId[raceId] = sList;

  // Weather placeholder
  weatherBySessionId[raceSessionId] = { airTemp: 22, trackTemp: 35, humidity: 55, conditions: 'DRY' };

  if (race.status === 'COMPLETED' && race.winner) {
    const seasonStandings = driverStandingsBySeason[race.season] || [];
    const winnerDriverEntry = Object.values(mockDrivers).find(d => d.name === race.winner);
    const winnerId = winnerDriverEntry ? winnerDriverEntry.id : 'driver_kimi_antonelli';

    // 1. Generate Qualifying List deterministically
    const qualDrivers = [...seasonStandings].map((ds) => {
      const seedString = `${raceId}_qual_${ds.driverId}`;
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
      }
      const noise = (Math.abs(hash) % 100) / 15 - 3; // -3 to 3.6
      let sortValue = ds.position + noise;
      if (ds.driverId === winnerId) {
        sortValue = -100; // Force winner near the top (e.g. pole position)
      }
      return { ds, sortValue, hash };
    }).sort((a, b) => a.sortValue - b.sortValue);

    const qList: QualifyingResult[] = qualDrivers.map((item, idx) => {
      const pos = idx + 1;
      const q3Sec = 12.0 + (pos * 0.15) + (Math.abs(item.hash) % 100) * 0.003;
      const q2Sec = q3Sec + 0.3;
      const q1Sec = q2Sec + 0.4;
      return {
        driverId: item.ds.driverId,
        constructorId: item.ds.constructorId,
        q1Time: `1:${q1Sec.toFixed(3)}`,
        q2Time: pos <= 15 ? `1:${q2Sec.toFixed(3)}` : undefined,
        q3Time: pos <= 10 ? `1:${q3Sec.toFixed(3)}` : undefined,
        position: pos
      };
    });
    qualifyingBySessionId[qualSessionId] = qList;

    // 2. Generate Race Results List deterministically
    const raceDrivers = [...seasonStandings].map((ds) => {
      const seedString = `${raceId}_race_${ds.driverId}`;
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
      }
      const noise = (Math.abs(hash) % 100) / 10 - 5; // -5 to 5
      
      // Determine if they DNF (8% chance, except the winner)
      const isDnf = (Math.abs(hash) % 100) < 8 && ds.driverId !== winnerId;
      
      let sortValue = ds.position + noise + (isDnf ? 1000 : 0);
      if (ds.driverId === winnerId) {
        sortValue = -1000; // Force winner to be 1st
      }
      return { ds, sortValue, isDnf, hash };
    }).sort((a, b) => a.sortValue - b.sortValue);

    const rList: RaceResult[] = [];
    const pointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    
    // Base winner time
    const winnerHours = 1;
    const winnerMins = 30 + (Math.abs(raceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15);
    const winnerSecs = 15.420;

    raceDrivers.forEach((item, idx) => {
      const pos = idx + 1;
      const points = pos <= 10 && !item.isDnf ? pointsMap[pos - 1] : 0;
      const gridPos = qList.find(q => q.driverId === item.ds.driverId)?.position || pos;
      
      let finishTime = '';
      let status: 'FINISHED' | 'DNF' = 'FINISHED';
      let lapsCompleted = race.laps;

      if (item.isDnf) {
        status = 'DNF';
        const dnfLaps = 10 + (Math.abs(item.hash) % (race.laps - 15));
        lapsCompleted = dnfLaps;
        const reasons = ['Engine failure', 'Suspension DNF', 'Spun off', 'Gearbox DNF', 'Collision DNF'];
        const reason = reasons[Math.abs(item.hash) % reasons.length];
        finishTime = `DNF - ${reason}`;
      } else if (pos === 1) {
        finishTime = `${winnerHours}:${String(winnerMins).padStart(2, '0')}:${winnerSecs.toFixed(3)}`;
      } else {
        const gap = (pos - 1) * 3.42 + (Math.abs(item.hash) % 100) * 0.05;
        finishTime = `+${gap.toFixed(3)}s`;
      }

      // Generate tire strategy and pit stops (30% chance of 2-stop, 70% chance of 1-stop)
      const isTwoStop = (Math.abs(item.hash) % 100) < 30;
      const tireStrategy: { compound: TireCompound; startLap: number; endLap: number }[] = [];
      const pitStops: { lap: number; duration: number; tireIn: TireCompound; tireOut: TireCompound }[] = [];

      const startCompound = (Math.abs(item.hash) % 2 === 0) ? TireCompound.MEDIUM : TireCompound.SOFT;

      if (isTwoStop) {
        const pitLap1 = Math.floor(race.laps * 0.25) + (Math.abs(item.hash) % 6);
        const pitLap2 = Math.floor(race.laps * 0.6) + (Math.abs(item.hash) % 8);
        
        const stint2Compound = (startCompound === TireCompound.SOFT) ? TireCompound.MEDIUM : TireCompound.HARD;
        const stint3Compound = (stint2Compound === TireCompound.MEDIUM) ? TireCompound.HARD : TireCompound.MEDIUM;

        // Stint 1
        const end1 = Math.min(pitLap1, lapsCompleted);
        tireStrategy.push({ compound: startCompound, startLap: 1, endLap: end1 });

        // Pit 1
        if (lapsCompleted > pitLap1) {
          pitStops.push({
            lap: pitLap1,
            duration: parseFloat((2.2 + (Math.abs(item.hash) % 10) * 0.08).toFixed(2)),
            tireIn: startCompound,
            tireOut: stint2Compound
          });

          // Stint 2
          const end2 = Math.min(pitLap2, lapsCompleted);
          tireStrategy.push({ compound: stint2Compound, startLap: pitLap1 + 1, endLap: end2 });

          // Pit 2
          if (lapsCompleted > pitLap2) {
            pitStops.push({
              lap: pitLap2,
              duration: parseFloat((2.1 + (Math.abs(item.hash + 1) % 10) * 0.08).toFixed(2)),
              tireIn: stint2Compound,
              tireOut: stint3Compound
            });

            // Stint 3
            tireStrategy.push({ compound: stint3Compound, startLap: pitLap2 + 1, endLap: lapsCompleted });
          }
        }
      } else {
        const pitLap = Math.floor(race.laps * 0.35) + (Math.abs(item.hash) % 10);
        const stint2Compound = (startCompound === TireCompound.SOFT) ? TireCompound.MEDIUM : TireCompound.HARD;

        // Stint 1
        const end1 = Math.min(pitLap, lapsCompleted);
        tireStrategy.push({ compound: startCompound, startLap: 1, endLap: end1 });

        // Pit 1
        if (lapsCompleted > pitLap) {
          pitStops.push({
            lap: pitLap,
            duration: parseFloat((2.3 + (Math.abs(item.hash) % 10) * 0.1).toFixed(2)),
            tireIn: startCompound,
            tireOut: stint2Compound
          });

          // Stint 2
          tireStrategy.push({ compound: stint2Compound, startLap: pitLap + 1, endLap: lapsCompleted });
        }
      }

      rList.push({
        driverId: item.ds.driverId,
        constructorId: item.ds.constructorId,
        gridPosition: gridPos,
        finishPosition: pos,
        points,
        lapsCompleted,
        finishTime,
        status,
        tireStrategy,
        pitStops
      });
    });
    
    resultsBySessionId[raceSessionId] = rList;

    // 3. Update the Race object in mockRaces
    const dnfCount = rList.filter(r => r.status === 'DNF').length;
    
    // Probabilistic Safety Cars and Red Flags model
    const scSeed = Math.abs(raceId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    let safetyCarsCount = 0;
    if (dnfCount === 0) {
      safetyCarsCount = (scSeed % 100) < 15 ? 1 : 0;
    } else if (dnfCount === 1) {
      safetyCarsCount = (scSeed % 100) < 60 ? 1 : 0;
    } else {
      safetyCarsCount = (scSeed % 100) < 85 ? (scSeed % 3 === 0 ? 2 : 1) : 0;
    }

    let redFlagsCount = 0;
    if (dnfCount >= 3 && (scSeed % 10) === 0) {
      redFlagsCount = 1;
    }
    
    const fastestDriverId = rList.find(r => r.finishPosition === (dnfCount % 2 === 0 ? 1 : 2))?.driverId || winnerId;
    const fastestLapSec = 72.5 + (Math.abs(raceId.charCodeAt(raceId.length - 1)) % 8) * 0.4;
    const flMins = Math.floor(fastestLapSec / 60);
    const flSecs = (fastestLapSec % 60).toFixed(3);
    const fastestLapTimeStr = flMins > 0 ? `${flMins}:${String(flSecs).padStart(6, '0')}` : flSecs;

    race.dnfs = dnfCount;
    race.safetyCars = safetyCarsCount;
    race.redFlags = redFlagsCount;
    race.fastestLap = {
      driverId: fastestDriverId,
      lap: Math.floor(race.laps * 0.7) + (Math.abs(raceId.charCodeAt(0)) % 10),
      time: fastestLapTimeStr
    };

    // 4. Generate Timeline Events
    const eventsList: RaceEvent[] = [];
    eventsList.push({ lap: 1, type: 'OVERTAKE', details: 'Lights out! The Grand Prix gets underway.' });
    
    rList.forEach(res => {
      const driver = mockDrivers[res.driverId];
      
      res.pitStops.forEach(pit => {
        eventsList.push({
          lap: pit.lap,
          type: 'PIT_STOP',
          driverId: res.driverId,
          details: `${driver ? driver.name : 'Driver'} pits for ${pit.tireOut} tires. Service time: ${pit.duration}s.`
        });
      });
      
      if (res.status === 'DNF') {
        const reason = (res.finishTime || '').replace('DNF - ', '');
        eventsList.push({
          lap: res.lapsCompleted,
          type: 'CRASH',
          driverId: res.driverId,
          details: `${driver ? driver.name : 'Driver'} is OUT of the race. Reason: ${reason} at Lap ${res.lapsCompleted}.`
        });
      }
    });

    if (safetyCarsCount === 1) {
      const scStartLap = Math.floor(race.laps * 0.4) + (Math.abs(raceId.charCodeAt(1)) % 10);
      eventsList.push({
        lap: scStartLap,
        type: 'SAFETY_CAR',
        details: 'Safety Car deployed due to track incident. Pack slows down.'
      });
      eventsList.push({
        lap: scStartLap + 3,
        type: 'SAFETY_CAR',
        details: 'Safety Car in. Green flag conditions resume.'
      });
    } else if (safetyCarsCount >= 2) {
      const scStartLap1 = Math.floor(race.laps * 0.25) + (Math.abs(raceId.charCodeAt(1)) % 5);
      eventsList.push({
        lap: scStartLap1,
        type: 'SAFETY_CAR',
        details: 'Safety Car deployed due to track incident. Pack slows down.'
      });
      eventsList.push({
        lap: scStartLap1 + 3,
        type: 'SAFETY_CAR',
        details: 'Safety Car in. Green flag conditions resume.'
      });

      const scStartLap2 = Math.floor(race.laps * 0.65) + (Math.abs(raceId.charCodeAt(2) || 0) % 5);
      eventsList.push({
        lap: scStartLap2,
        type: 'SAFETY_CAR',
        details: 'Safety Car deployed due to track incident. Pack slows down.'
      });
      eventsList.push({
        lap: scStartLap2 + 3,
        type: 'SAFETY_CAR',
        details: 'Safety Car in. Green flag conditions resume.'
      });
    }

    if (redFlagsCount > 0) {
      const rfLap = Math.floor(race.laps * 0.5) + (Math.abs(raceId.charCodeAt(0)) % 5);
      eventsList.push({
        lap: rfLap,
        type: 'YELLOW_FLAG',
        details: 'RED FLAG: Session suspended due to serious track incident.'
      });
      eventsList.push({
        lap: rfLap,
        type: 'OVERTAKE',
        details: 'Race restarted under green flag conditions.'
      });
    }

    eventsList.sort((a, b) => a.lap - b.lap);
    timelineBySessionId[raceSessionId] = eventsList;

    // 5. Generate Lap Telemetry Times
    const raceLapTimes: Record<string, LapTime[]> = {};
    rList.forEach(res => {
      const driverLaps: LapTime[] = [];
      const lapsCount = res.lapsCompleted;
      
      const circuitDistance = race.distanceKm;
      const circuitLaps = race.laps;
      const baseLapTime = (circuitDistance / circuitLaps) * 22; // estimation
      const paceMod = (res.finishPosition - 1) * 0.12;

      for (let lap = 1; lap <= lapsCount; lap++) {
        const seedStr = `${raceId}_telemetry_${res.driverId}_lap_${lap}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
          hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const noise = (Math.abs(hash) % 100) / 100 - 0.5; // -0.5s to 0.5s
        const fuelEffect = (circuitLaps - lap) * 0.035;
        let lapTimeVal = baseLapTime + paceMod + noise - fuelEffect;
        
        const isPitLap = res.pitStops.some(p => p.lap === lap);
        if (isPitLap) {
          lapTimeVal += 23.5;
        }

        const s1 = parseFloat((lapTimeVal * 0.3 + (Math.abs(hash) % 10) * 0.01).toFixed(3));
        const s2 = parseFloat((lapTimeVal * 0.4 + (Math.abs(hash + 1) % 10) * 0.01).toFixed(3));
        const s3 = parseFloat((lapTimeVal - s1 - s2).toFixed(3));

        driverLaps.push({
          lap,
          driverId: res.driverId,
          lapTime: parseFloat(lapTimeVal.toFixed(3)),
          sector1: s1,
          sector2: s2,
          sector3: s3,
          tire: (() => {
            const stint = res.tireStrategy.find(st => lap >= st.startLap && lap <= st.endLap);
            return stint ? stint.compound : TireCompound.MEDIUM;
          })(),
          source: 'MOCK'
        });
      }
      raceLapTimes[res.driverId] = driverLaps;
    });

    lapTimesBySessionId[raceSessionId] = raceLapTimes;
  }
});

// Canonical flat datastore
export const db: NormalizedDatastore = {
  driversById: mockDrivers,
  constructorsById: mockConstructors,
  racesById: mockRaces,
  sessionsByRaceId,
  resultsBySessionId,
  qualifyingBySessionId,
  lapTimesBySessionId,
  timelineBySessionId,
  weatherBySessionId,
  driverHistoryById: mockDriverHistory,
  driverStandingsBySeason,
  constructorStandingsBySeason,
};
export default db;
