export enum TireCompound {
  SOFT = 'SOFT',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  INTER = 'INTER',
  WET = 'WET',
}

export enum SessionType {
  FP1 = 'FP1',
  FP2 = 'FP2',
  FP3 = 'FP3',
  QUALIFYING = 'QUALIFYING',
  SPRINT = 'SPRINT',
  RACE = 'RACE',
}

export type DataSource = 'MOCK' | 'OPENF1' | 'ERGAST';

export interface Driver {
  id: string; // e.g. "driver_max_verstappen"
  name: string;
  code: string; // e.g. "VER"
  number: number;
  nationality: string;
  dob: string;
  countryName: string;
  
  // Simulation traits (Tier 1 rating parameters)
  paceRating: number;
  consistency: number;
  tireManagement: number;
  wetWeatherSkill: number;
}

export interface Constructor {
  id: string; // e.g. "constructor_mercedes"
  name: string;
  country: string;
  base: string;
}

export interface SeasonDriverStats {
  driverId: string;
  constructorId: string;
  points: number;
  position: number;
  wins: number;
  podiums: number;
}

export interface SeasonConstructorStats {
  constructorId: string;
  points: number;
  position: number;
  wins: number;
}

export interface WeatherSnapshot {
  airTemp: number;
  trackTemp: number;
  humidity: number;
  conditions: 'DRY' | 'WET' | 'MIXED';
  rainProbability?: number;
}

export interface PitStop {
  lap: number;
  duration: number;
  tireIn: TireCompound;
  tireOut: TireCompound;
}

export interface TireStint {
  compound: TireCompound;
  startLap: number;
  endLap: number;
}

export interface LapTime {
  lap: number;
  driverId: string;
  lapTime: number;
  sector1: number;
  sector2: number;
  sector3: number;
  tire: TireCompound;
  source?: DataSource;
}

export interface QualifyingResult {
  driverId: string;
  constructorId: string;
  q1Time?: string;
  q2Time?: string;
  q3Time?: string;
  position: number;
}

export interface RaceResult {
  driverId: string;
  constructorId: string;
  gridPosition: number;
  finishPosition: number;
  points: number;
  lapsCompleted: number;
  finishTime?: string;
  status: 'FINISHED' | 'DNF' | 'DNS' | 'DSQ';
  tireStrategy: TireStint[];
  pitStops: PitStop[];
}

export interface Session {
  id: string; // e.g. "session_2026_monaco_race"
  raceId: string; // e.g. "race_2026_monaco"
  type: SessionType;
  date: string;
  startTime: string;
}

export interface RaceEvent {
  lap: number;
  type: 'PIT_STOP' | 'SAFETY_CAR' | 'OVERTAKE' | 'CRASH' | 'YELLOW_FLAG' | 'RAIN_START' | 'RAIN_STOP';
  driverId?: string;
  details?: string;
}

export interface Race {
  id: string; // e.g. "race_2026_monaco"
  season: number;
  round: number;
  name: string;
  circuit: string;
  country: string;
  date: string; // GP Sunday date
  laps: number;
  distanceKm: number;
  status: 'COMPLETED' | 'CANCELED' | 'UPCOMING';
  winner?: string; // Summary winner name (helper text)
  weather?: WeatherSnapshot;
  safetyCars?: number;
  redFlags?: number;
  dnfs?: number;
  fastestLap?: {
    driverId: string;
    lap: number;
    time: string;
  };
  pitStopStats?: {
    totalStops: number;
    averageDuration: number;
    fastestStop?: {
      driverId: string;
      teamId: string;
      duration: number;
    };
  };
}

// Normalized Datastore Layer
export interface NormalizedDatastore {
  driversById: Record<string, Driver>;
  constructorsById: Record<string, Constructor>;
  racesById: Record<string, Race>;
  sessionsByRaceId: Record<string, Session[]>;
  resultsBySessionId: Record<string, RaceResult[]>;
  qualifyingBySessionId: Record<string, QualifyingResult[]>;
  lapTimesBySessionId: Record<string, Record<string, LapTime[]>>; // sessionId -> driverId -> LapTimes[]
  timelineBySessionId: Record<string, RaceEvent[]>;
  weatherBySessionId: Record<string, WeatherSnapshot>;
  driverHistoryById: Record<string, DriverCareerHistory>;
  
  // Standings indexes by Season Year
  driverStandingsBySeason: Record<number, SeasonDriverStats[]>;
  constructorStandingsBySeason: Record<number, SeasonConstructorStats[]>;
}

export interface CareerYear {
  year: number;
  team: string;
  position: number;
  points: number;
  wins: number;
  podiums: number;
}

export interface DriverCareerHistory {
  driverId: string;
  championships: number;
  wins: number;
  podiums: number;
  poles: number;
  entries: number;
  careerPoints: number;
  biography: string;
  careerLog: CareerYear[];
}


// ==========================================
// TELEMETRY SIMULATION ENGINE SCHEMA
// ==========================================

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
}

export interface RaceSimulationSeed {
  raceId: string;
  laps: number;
  distanceKm: number;
  safetyCarLaps: number[];
  weatherTimeline: WeatherTimelineEvent[];
  driverSeeds: DriverSimulationSeed[];
  qualifyingResults: QualifyingResult[];
}

