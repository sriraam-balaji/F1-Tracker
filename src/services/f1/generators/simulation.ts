import { Race, RaceResult, QualifyingResult, LapTime, RaceEvent, WeatherSnapshot, Session, SessionType, TireCompound, Driver, Constructor } from '../types';
import { SeededRandom } from './random';
import { mockDrivers } from '../data/drivers';

export interface SimulationOutput {
  race: Race;
  sessions: Session[];
  results: RaceResult[];
  qualifying: QualifyingResult[];
  lapTimes: Record<string, LapTime[]>; // driverId -> LapTime[]
  events: RaceEvent[];
  weather: WeatherSnapshot;
}

export function generateRaceTelemetry(seed: RaceSimulationSeed): SimulationOutput {
  const rand = new SeededRandom(seed.raceId + '_simulation');
  
  // Get active weather timeline conditions on a given lap
  const getWeatherForLap = (lap: number): WeatherSnapshot => {
    let active = seed.weatherTimeline[0];
    for (const event of seed.weatherTimeline) {
      if (lap >= event.lap) {
        active = event;
      } else {
        break;
      }
    }
    return {
      airTemp: active.airTemp,
      trackTemp: active.trackTemp,
      humidity: active.humidity,
      conditions: active.conditions,
      rainProbability: active.rainProbability
    };
  };

  const results: RaceResult[] = [];
  const lapTimes: Record<string, LapTime[]> = {};
  const events: RaceEvent[] = [];

  // Track dynamic simulation metrics per driver
  interface DriverSimState {
    driverId: string;
    constructorId: string;
    driverMeta: Driver;
    gridPosition: number;
    cumulativeTime: number; // in seconds
    currentStintIndex: number;
    currentTire: TireCompound;
    tireAge: number;
    lapsCompleted: number;
    isDNF: boolean;
    dnfLap?: number;
    dnfReason?: string;
    pitStops: { lap: number; duration: number; tireIn: TireCompound; tireOut: TireCompound }[];
    tireStrategy: { compound: TireCompound; startLap: number; endLap: number }[];
  }

  const driverStates: DriverSimState[] = seed.driverSeeds.map(ds => {
    const meta = { ...mockDrivers[ds.driverId] };
    if (ds.paceRating !== undefined) meta.paceRating = ds.paceRating;
    if (ds.consistency !== undefined) meta.consistency = ds.consistency;
    return {
      driverId: ds.driverId,
      constructorId: ds.constructorId,
      driverMeta: meta,
      gridPosition: ds.gridPosition,
      cumulativeTime: 0,
      currentStintIndex: 0,
      currentTire: ds.baseStrategy[0],
      tireAge: 0,
      lapsCompleted: 0,
      isDNF: false,
      pitStops: [],
      tireStrategy: [{ compound: ds.baseStrategy[0], startLap: 1, endLap: seed.laps }],
    };
  });

  // Track timeline events chronologically
  events.push({ lap: 1, type: 'OVERTAKE', details: 'Lights out! The Grand Prix gets underway.' });

  // Simulate lap by lap
  for (let lap = 1; lap <= seed.laps; lap++) {
    const weather = getWeatherForLap(lap);
    const isSafetyCar = seed.safetyCarLaps.includes(lap);

    // Weather transition event triggers
    const weatherChange = seed.weatherTimeline.find(w => w.lap === lap);
    if (weatherChange) {
      events.push({
        lap,
        type: weatherChange.conditions === 'DRY' ? 'RAIN_STOP' : 'RAIN_START',
        details: `Weather update: Track condition is now ${weatherChange.conditions}. Air Temp: ${weatherChange.airTemp}°C.`
      });
    }

    // Safety car trigger events
    if (isSafetyCar && !seed.safetyCarLaps.includes(lap - 1)) {
      events.push({ lap, type: 'SAFETY_CAR', details: 'Safety Car deployed. Pack slows down.' });
    }
    if (!isSafetyCar && seed.safetyCarLaps.includes(lap - 1)) {
      events.push({ lap, type: 'SAFETY_CAR', details: 'Safety Car in. Green flag conditions resume.' });
    }

    // Sort active drivers by their current cumulativeTime to get track order
    const activeStates = driverStates.filter(s => !s.isDNF);
    const orderedStates = [...activeStates].sort((a, b) => {
      if (lap === 1) return a.gridPosition - b.gridPosition;
      return a.cumulativeTime - b.cumulativeTime;
    });

    const startTimes: Record<string, number> = {};
    orderedStates.forEach(s => {
      startTimes[s.driverId] = s.cumulativeTime;
    });

    const lapTimesForThisLap: Record<string, number> = {};

    orderedStates.forEach((state, i) => {
      const driver = state.driverMeta;
      const driverRand = new SeededRandom(driver.id + `_lap_${lap}`);

      // 1. DNF check (low probability based on consistency)
      const dnfChance = 0.001 + (100 - driver.consistency) * 0.0001;
      // Force DNF for Verstappen Monaco lap 70 for simulation narrative
      const isMonacoVerstappenDnf = seed.raceId === 'race_2026_monaco' && driver.id === 'driver_max_verstappen' && lap === 70;
      
      const isExpectedWinner = seed.expectedWinnerId === driver.id;
      if (((driverRand.next() < dnfChance && !isExpectedWinner) || isMonacoVerstappenDnf) && !isExpectedWinner) {
        state.isDNF = true;
        state.dnfLap = lap;
        state.dnfReason = isMonacoVerstappenDnf ? 'Gearbox DNF' : (driverRand.next() > 0.5 ? 'Suspension failure' : 'Spun off');
        
        // Update stint end lap
        state.tireStrategy[state.currentStintIndex].endLap = lap;
        events.push({
          lap,
          type: 'CRASH',
          driverId: state.driverId,
          details: `${driver.name} is OUT of the race. Reason: ${state.dnfReason} at Lap ${lap}.`
        });
        return;
      }

      // 2. Check for pit stop on this lap
      const driverSeed = seed.driverSeeds.find(ds => ds.driverId === state.driverId);
      const isPlannedPit = driverSeed?.plannedPitLaps.includes(lap) || false;
      
      // Auto-pit if wet and on slick tires, or dry and on wet tires
      const needsWetPit = (weather.conditions === 'WET' || weather.conditions === 'MIXED') && 
                          (state.currentTire === TireCompound.SOFT || state.currentTire === TireCompound.MEDIUM || state.currentTire === TireCompound.HARD);
      const needsDryPit = weather.conditions === 'DRY' && 
                          (state.currentTire === TireCompound.INTER || state.currentTire === TireCompound.WET);
      
      let nextTire = state.currentTire;
      let shouldPit = false;

      if (needsWetPit) {
        nextTire = TireCompound.INTER;
        shouldPit = true;
      } else if (needsDryPit) {
        nextTire = TireCompound.MEDIUM;
        shouldPit = true;
      } else if (isPlannedPit && driverSeed) {
        // Look up the next tire in the base strategy
        const plannedNextTire = driverSeed.baseStrategy[state.currentStintIndex + 1] || TireCompound.SOFT;
        if (plannedNextTire !== state.currentTire) {
          nextTire = plannedNextTire;
          shouldPit = true;
          state.currentStintIndex++;
        } else {
          // Progress strategy index to keep in sync, but do not actually pit
          state.currentStintIndex++;
        }
      }

      let pitAddedTime = 0;
      if (shouldPit) {
        const pitDuration = parseFloat(driverRand.range(2.1, 3.2).toFixed(2));
        const oldTire = state.currentTire;
        
        state.pitStops.push({
          lap,
          duration: pitDuration,
          tireIn: oldTire,
          tireOut: nextTire
        });

        // Finalize old stint end, start new stint
        state.tireStrategy[state.tireStrategy.length - 1].endLap = lap;
        state.tireStrategy.push({
          compound: nextTire,
          startLap: lap + 1,
          endLap: seed.laps
        });

        state.currentTire = nextTire;
        state.tireAge = 0;
        pitAddedTime = pitDuration + 20.5; // Pit service + lane delay

        events.push({
          lap,
          type: 'PIT_STOP',
          driverId: state.driverId,
          details: `${driver.name} pits for ${nextTire} tires. Service time: ${pitDuration}s.`
        });
      }

      // 3. Dynamic Race Mode determination
      let mode = 'Normal';
      let paceDelta = 0.0;
      let wearMultiplier = 1.0;

      const gapAhead = i > 0 ? startTimes[state.driverId] - startTimes[orderedStates[i-1].driverId] : 999;
      const gapBehind = i < orderedStates.length - 1 ? startTimes[orderedStates[i+1].driverId] - startTimes[state.driverId] : 999;
      
      const lapsToNextPit = driverSeed 
        ? (driverSeed.plannedPitLaps.find(p => p > lap) ? (driverSeed.plannedPitLaps.find(p => p > lap)! - lap) : 999)
        : 999;

      // Compound base lifetime estimation
      let baseTireLife = 30;
      if (state.currentTire === TireCompound.SOFT) baseTireLife = 15;
      else if (state.currentTire === TireCompound.MEDIUM) baseTireLife = 30;
      else if (state.currentTire === TireCompound.HARD) baseTireLife = 50;
      else if (state.currentTire === TireCompound.INTER) baseTireLife = 35;
      else if (state.currentTire === TireCompound.WET) baseTireLife = 40;

      const tireAgePercent = state.tireAge / baseTireLife;

      const isMonaco = seed.raceId === 'race_2026_monaco';
      const followingWindow = isMonaco ? 1.2 : 2.0;

      if (!isSafetyCar && gapAhead < followingWindow && pitAddedTime === 0) {
        mode = 'Traffic';
        paceDelta = isMonaco ? 0.35 : 0.15; // stuck behind, matching pace ahead
        wearMultiplier = 0.7;
      } else if (lapsToNextPit <= 2 && pitAddedTime === 0) {
        mode = 'Push';
        paceDelta = -0.5;
        wearMultiplier = 1.4;
      } else if (gapBehind < followingWindow && pitAddedTime === 0) {
        mode = 'Push'; // Defending
        paceDelta = -0.3;
        wearMultiplier = 1.3;
      } else if (tireAgePercent > 0.75) {
        mode = 'Save Tires';
        paceDelta = 1.0;
        wearMultiplier = 0.4;
      } else if (tireAgePercent > 0.5) {
        mode = 'Manage';
        paceDelta = 0.6;
        wearMultiplier = 0.7;
      } else {
        mode = 'Normal';
        paceDelta = 0.0;
        wearMultiplier = 1.0;
      }

      // Constructor performance rating
      const constructorPaceRating: Record<string, number> = {
        constructor_mercedes: 96,
        constructor_ferrari: 95,
        constructor_mclaren: 94,
        constructor_red_bull: 93,
        constructor_alpine: 88,
        constructor_haas: 87,
        constructor_rb: 87,
        constructor_williams: 85,
        constructor_sauber: 82,
        constructor_aston_martin: 80,
      };

      const carPace = constructorPaceRating[state.constructorId] || 85;
      const combinedPace = (driver.paceRating * 0.60) + (carPace * 0.40);

      // Base race pace is around 74s. Speed Rating reduces times.
      let lapTime = 74.0 - (combinedPace * 0.04);
      
      // Fuel burn weight loss factor (laps get faster by ~0.05s as fuel burns)
      const fuelEffect = (seed.laps - lap) * 0.05;
      lapTime -= fuelEffect;

      // Tire Compound performance mapping
      let tirePaceMod = 0;
      if (state.currentTire === TireCompound.SOFT) tirePaceMod = -0.4;
      if (state.currentTire === TireCompound.MEDIUM) tirePaceMod = 0.0;
      if (state.currentTire === TireCompound.HARD) tirePaceMod = 0.5;
      if (state.currentTire === TireCompound.INTER) tirePaceMod = weather.conditions !== 'DRY' ? 1.0 : 8.0;
      if (state.currentTire === TireCompound.WET) tirePaceMod = weather.conditions === 'WET' ? 2.0 : 12.0;
      
      lapTime += tirePaceMod;

      // Saturating Tire Wear Degradation factor
      let maxDegPenalty = 1.6;
      let tireLife = 30;

      if (state.currentTire === TireCompound.SOFT) {
        maxDegPenalty = 2.2;
        tireLife = 15;
      } else if (state.currentTire === TireCompound.MEDIUM) {
        maxDegPenalty = 1.6;
        tireLife = 30;
      } else if (state.currentTire === TireCompound.HARD) {
        maxDegPenalty = 1.1;
        tireLife = 50;
      } else if (state.currentTire === TireCompound.INTER) {
        if (weather.conditions === 'DRY') {
          maxDegPenalty = 8.0;
          tireLife = 5;
        } else {
          maxDegPenalty = 1.8;
          tireLife = 35;
        }
      } else if (state.currentTire === TireCompound.WET) {
        if (weather.conditions === 'DRY') {
          maxDegPenalty = 12.0;
          tireLife = 4;
        } else {
          maxDegPenalty = 2.2;
          tireLife = 40;
        }
      }

      // Driver tire management preservation scaling
      const driverPreservation = 0.8 + (driver.tireManagement / 100) * 0.4; // between 0.8 and 1.2
      const effectiveTireLife = tireLife * driverPreservation;
      const degFactor = maxDegPenalty * (1 - Math.exp(-state.tireAge / effectiveTireLife));
      lapTime += degFactor;

      // Safety Car lap times slowdown or normal lap factors
      if (isSafetyCar) {
        lapTime = baseSCTimeForTrack(seed.raceId) + driverRand.range(-0.5, 0.5);
      } else {
        // Driver variance based on consistency rating
        const consistencyVariance = (100 - driver.consistency) * 0.012;
        lapTime += driverRand.range(-consistencyVariance, consistencyVariance);

        // Wet weather driving skill penalty
        if (weather.conditions !== 'DRY') {
          const wetSkillPenalty = (100 - driver.wetWeatherSkill) * 0.04;
          lapTime += wetSkillPenalty;
        }

        // Apply paceDelta from race mode (Push, Manage, Save Tires, Traffic)
        lapTime += paceDelta;
      }

      // Add pit stop lane duration delay
      lapTime += pitAddedTime;

      // 4. Traffic, DRS, and Overtaking Logic
      if (!isSafetyCar && i > 0 && pitAddedTime === 0) {
        const leaderState = orderedStates[i-1];
        const leaderLapTime = lapTimesForThisLap[leaderState.driverId];
        const leaderPitted = leaderState.pitStops.some(p => p.lap === lap);

        if (leaderLapTime !== undefined && !leaderPitted) {
          const gap = startTimes[state.driverId] - startTimes[leaderState.driverId];
          
          if (gap <= followingWindow) {
            // Apply dirty air penalty inside following window
            const dirtyAirPenalty = isMonaco ? 0.45 : 0.20;
            lapTime += dirtyAirPenalty;

            // Overtake probability model
            const baseChance = isMonaco ? 0.005 : (seed.raceId === 'race_2026_canada' ? 0.06 : 0.04);
            
            // Calculate tire performance difference
            const chaserTireAge = state.tireAge;
            const leaderTireAge = leaderState.tireAge;
            const chaserTireComp = state.currentTire;
            const leaderTireComp = leaderState.currentTire;
            
            const compPaceValue: Record<string, number> = { 
              [TireCompound.SOFT]: 2, 
              [TireCompound.MEDIUM]: 1, 
              [TireCompound.HARD]: 0, 
              [TireCompound.INTER]: 0, 
              [TireCompound.WET]: 0 
            };
            const tireCompDelta = (compPaceValue[chaserTireComp] || 0) - (compPaceValue[leaderTireComp] || 0);
            const tireAgeDelta = leaderTireAge - chaserTireAge;
            const tireDeltaScore = tireCompDelta * 0.5 + (tireAgeDelta * 0.02);
            
            // Pace delta (positive if chaser is running faster)
            const paceDeltaScore = leaderLapTime - lapTime;
            
            // DRS factor
            const drsFactor = gap <= 1.0 ? (isMonaco ? 1.2 : 2.0) : 1.0;
            
            // Mode factor
            const chaserPushFactor = mode === 'Push' ? 1.5 : 1.0;
            
            // Total overtake chance
            let overtakeChance = baseChance;
            if (paceDeltaScore > 0) {
              overtakeChance += paceDeltaScore * (isMonaco ? 0.05 : 0.25);
            }
            if (tireDeltaScore > 0) {
              overtakeChance += tireDeltaScore * (isMonaco ? 0.03 : 0.10);
            }
            overtakeChance *= drsFactor * chaserPushFactor;
            overtakeChance = Math.min(isMonaco ? 0.25 : 0.85, Math.max(0.001, overtakeChance));

            const overtakeRand = new SeededRandom(state.driverId + `_lap_${lap}_overtake`);
            if (overtakeRand.next() < overtakeChance) {
              // Successful overtake! Swap positions in time slightly
              lapTime = (startTimes[leaderState.driverId] + leaderLapTime - 0.2) - startTimes[state.driverId];
              
              events.push({
                lap,
                type: 'OVERTAKE',
                driverId: state.driverId,
                details: `${driver.name} performs an overtake on ${leaderState.driverMeta.name} for P${i}.`
              });
            } else {
              // Failed overtake - stuck in traffic (DRS train)
              const minFinishGap = 0.35 + overtakeRand.range(-0.1, 0.1);
              const leaderFinishTime = startTimes[leaderState.driverId] + leaderLapTime;
              if (startTimes[state.driverId] + lapTime < leaderFinishTime + minFinishGap) {
                lapTime = (leaderFinishTime + minFinishGap) - startTimes[state.driverId];
              }
            }
          } else if (gap < 4.0) {
            // Pace compression: tow bonus pulls chaser closer if they are in clean air but close behind
            const towBonus = isMonaco ? 0.05 : 0.25;
            lapTime -= towBonus;
          }
        }
      }

      // Record this lap's final time
      lapTimesForThisLap[state.driverId] = lapTime;

      // Format sector Times S1 S2 S3
      const s1Ratio = seed.raceId === 'race_2026_canada' ? 0.32 : 0.28;
      const s2Ratio = seed.raceId === 'race_2026_canada' ? 0.38 : 0.42;
      const s3Ratio = 1.0 - s1Ratio - s2Ratio;

      const lapTimeFormatted = parseFloat(lapTime.toFixed(3));
      const s1 = parseFloat((lapTimeFormatted * s1Ratio + driverRand.range(-0.15, 0.15)).toFixed(3));
      const s2 = parseFloat((lapTimeFormatted * s2Ratio + driverRand.range(-0.15, 0.15)).toFixed(3));
      const s3 = parseFloat((lapTimeFormatted - s1 - s2).toFixed(3));

      // Push telemetry lap time record
      if (!lapTimes[state.driverId]) {
        lapTimes[state.driverId] = [];
      }
      
      lapTimes[state.driverId].push({
        lap,
        driverId: state.driverId,
        lapTime: lapTimeFormatted,
        sector1: s1,
        sector2: s2,
        sector3: s3,
        tire: state.currentTire,
        source: 'MOCK',
      });
      // Update states
      state.cumulativeTime += lapTimeFormatted;
      state.lapsCompleted = lap;
      state.tireAge += wearMultiplier;
    });
  }


  // 4. Lap Classification and Standings Post-Processing
  const activeFinishers = driverStates.filter(s => !s.isDNF);
  // Find winner (non-DNF with minimum cumulative time)
  const winnerState = activeFinishers.reduce((min, s) => s.cumulativeTime < min.cumulativeTime ? s : min, activeFinishers[0]);
  const winnerTime = winnerState.cumulativeTime;
  const leaderAvgLapTime = winnerTime / seed.laps;

  driverStates.forEach(state => {
    if (state.isDNF) return;
    const gap = state.cumulativeTime - winnerTime;
    if (gap > leaderAvgLapTime) {
      const lapsDown = Math.floor(gap / leaderAvgLapTime);
      state.lapsCompleted = seed.laps - lapsDown;
      
      // Truncate lapTimes to only count completed laps
      if (lapTimes[state.driverId]) {
        lapTimes[state.driverId] = lapTimes[state.driverId].slice(0, state.lapsCompleted);
      }
      
      // Re-calculate cumulativeTime based on truncated laps
      state.cumulativeTime = parseFloat(
        lapTimes[state.driverId].reduce((sum, l) => sum + l.lapTime, 0).toFixed(3)
      );
    }
  });

  // Now sort the standings
  const sortedStates = [...driverStates].sort((a, b) => {
    if (a.isDNF && !b.isDNF) return 1;
    if (!a.isDNF && b.isDNF) return -1;
    if (a.isDNF && b.isDNF) {
      return b.lapsCompleted - a.lapsCompleted; // both DNF, who completed more laps is better
    }
    if (a.lapsCompleted !== b.lapsCompleted) {
      return b.lapsCompleted - a.lapsCompleted; // more laps completed is better
    }
    return a.cumulativeTime - b.cumulativeTime; // less time is better
  });

  // Hydrate RaceResults
  const pointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  sortedStates.forEach((state, index) => {
    const points = index < 10 && !state.isDNF ? pointsMap[index] : 0;
    const finishPosition = index + 1;

    let finishTime = '';
    if (state.isDNF) {
      finishTime = `DNF - ${state.dnfReason}`;
    } else if (index === 0) {
      // Winner shows absolute hour:min:sec time
      const hrs = Math.floor(winnerTime / 3600);
      const mins = Math.floor((winnerTime % 3600) / 60);
      const secs = (winnerTime % 60).toFixed(3);
      finishTime = `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else if (state.lapsCompleted < seed.laps) {
      const lapsDown = seed.laps - state.lapsCompleted;
      finishTime = `+${lapsDown} Lap${lapsDown > 1 ? 's' : ''}`;
    } else {
      // Others show gap to winner
      const gap = state.cumulativeTime - winnerTime;
      finishTime = `+${gap.toFixed(3)}s`;
    }

    // Filter strategy and pit stops to match laps completed (for lapped/DNF drivers)
    const filteredPitStops = state.pitStops
      .filter(p => p.lap <= state.lapsCompleted)
      .map(p => ({
        lap: p.lap,
        duration: p.duration,
        tireIn: p.tireIn,
        tireOut: p.tireOut
      }));

    const filteredTireStrategy = state.tireStrategy
      .filter(s => s.startLap <= state.lapsCompleted)
      .map(s => ({
        compound: s.compound,
        startLap: s.startLap,
        endLap: Math.min(s.endLap, state.lapsCompleted)
      }));

    results.push({
      driverId: state.driverId,
      constructorId: state.constructorId,
      gridPosition: state.gridPosition,
      finishPosition,
      points,
      lapsCompleted: state.lapsCompleted,
      finishTime,
      status: state.isDNF ? 'DNF' : 'FINISHED',
      tireStrategy: filteredTireStrategy,
      pitStops: filteredPitStops,
    });
  });

  // Find the fastest lap from all generated lap times
  let bestLapTime = 99999;
  let bestLapDriver = '';
  let bestLapNum = 0;

  Object.entries(lapTimes).forEach(([driverId, laps]) => {
    laps.forEach(l => {
      // Avoid counting pit stop laps or safety car laps
      if (l.lapTime < bestLapTime && !seed.safetyCarLaps.includes(l.lap) && !seed.driverSeeds.find(ds => ds.driverId === driverId)?.plannedPitLaps.includes(l.lap)) {
        bestLapTime = l.lapTime;
        bestLapDriver = driverId;
        bestLapNum = l.lap;
      }
    });
  });

  // Calculate session objects
  const sessions: Session[] = [
    { id: `session_${seed.raceId.split('_').pop()}_qualifying`, raceId: seed.raceId, type: SessionType.QUALIFYING, date: seed.weatherTimeline[0].conditions === 'DRY' ? '2026-06-06' : '2026-05-23', startTime: '16:00' },
    { id: `session_${seed.raceId.split('_').pop()}_race`, raceId: seed.raceId, type: SessionType.RACE, date: seed.weatherTimeline[0].conditions === 'DRY' ? '2026-06-07' : '2026-05-24', startTime: '14:00' },
  ];

  // Map generated metrics back to Race details
  const winnerName = mockDrivers[sortedStates[0].driverId]?.name || 'Unknown';
  
  const pitStopsCount = results.reduce((acc, r) => acc + r.pitStops.length, 0);
  const allStops = results.flatMap(r => r.pitStops);
  const avgPitDuration = allStops.length ? parseFloat((allStops.reduce((acc, s) => acc + s.duration, 0) / allStops.length).toFixed(2)) : 0;
  const fastestStopEntry = results.flatMap(r => r.pitStops.map(p => ({ driverId: r.driverId, duration: p.duration, constructorId: r.constructorId }))).sort((a,b) => a.duration - b.duration)[0];

  const race: Race = {
    id: seed.raceId,
    season: 2026,
    round: seed.raceId === 'race_2026_monaco' ? 8 : 7,
    name: seed.raceId === 'race_2026_monaco' ? 'Monaco Grand Prix' : 'Canadian Grand Prix',
    circuit: seed.raceId === 'race_2026_monaco' ? 'Circuit de Monaco' : 'Circuit Gilles Villeneuve',
    country: seed.raceId === 'race_2026_monaco' ? 'Monaco' : 'Canada',
    date: seed.raceId === 'race_2026_monaco' ? '2026-06-07' : '2026-05-24',
    laps: seed.laps,
    distanceKm: seed.distanceKm,
    status: 'COMPLETED',
    winner: winnerName,
    weather: getWeatherForLap(seed.laps),
    safetyCars: (() => {
      let scCount = 0;
      for (let i = 0; i < seed.safetyCarLaps.length; i++) {
        if (i === 0 || seed.safetyCarLaps[i] !== seed.safetyCarLaps[i - 1] + 1) {
          scCount++;
        }
      }
      return scCount;
    })(),
    dnfs: sortedStates.filter(s => s.isDNF).length,
    redFlags: 0,
    fastestLap: {
      driverId: bestLapDriver,
      lap: bestLapNum,
      time: formatLapTime(bestLapTime),
    },
    pitStopStats: {
      totalStops: pitStopsCount,
      averageDuration: avgPitDuration,
      fastestStop: fastestStopEntry ? {
        driverId: fastestStopEntry.driverId,
        teamId: fastestStopEntry.constructorId,
        duration: fastestStopEntry.duration
      } : undefined
    }
  };

  return {
    race,
    sessions,
    results,
    qualifying: seed.qualifyingResults,
    lapTimes,
    events,
    weather: getWeatherForLap(seed.laps),
  };
}

// Helpers
function baseSCTimeForTrack(trackId: string): number {
  if (trackId === 'race_2026_monaco') return 112.5; // Monaco SC lap is slow
  return 105.0; // Canada SC lap
}

function formatLapTime(time: number): string {
  const mins = Math.floor(time / 60);
  const secs = (time % 60).toFixed(3);
  return mins > 0 ? `${mins}:${String(secs).padStart(6, '0')}` : secs;
}

export interface WeatherTimelineEvent {
  lap: number;
  conditions: 'DRY' | 'WET' | 'MIXED';
  airTemp: number;
  trackTemp: number;
  humidity: number;
  rainProbability?: number;
}

export interface DriverSimulationSeed {
  driverId: string;
  constructorId: string;
  gridPosition: number;
  baseStrategy: TireCompound[];
  plannedPitLaps: number[];
  paceRating?: number;
  consistency?: number;
}

export interface RaceSimulationSeed {
  raceId: string;
  laps: number;
  distanceKm: number;
  safetyCarLaps: number[];
  weatherTimeline: WeatherTimelineEvent[];
  driverSeeds: DriverSimulationSeed[];
  qualifyingResults: QualifyingResult[];
  expectedWinnerId?: string;
}
