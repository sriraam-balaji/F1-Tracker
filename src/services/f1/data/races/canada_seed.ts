import { RaceSimulationSeed, TireCompound } from '../../types';

export const canada2026Seed: RaceSimulationSeed = {
  raceId: 'race_2026_canada',
  expectedWinnerId: 'driver_kimi_antonelli',
  laps: 70,
  distanceKm: 305.270,
  safetyCarLaps: [30, 31, 32, 33],
  weatherTimeline: [
    { lap: 1, conditions: 'DRY', airTemp: 19.5, trackTemp: 26.2, humidity: 65, rainProbability: 20 },
    { lap: 12, conditions: 'WET', airTemp: 17.1, trackTemp: 21.8, humidity: 95, rainProbability: 98 },
    { lap: 45, conditions: 'DRY', airTemp: 18.2, trackTemp: 24.5, humidity: 75, rainProbability: 15 },
  ],
  driverSeeds: [
    { driverId: 'driver_kimi_antonelli', constructorId: 'constructor_mercedes', gridPosition: 1, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 48] },
    { driverId: 'driver_george_russell', constructorId: 'constructor_mercedes', gridPosition: 2, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 49] },
    { driverId: 'driver_lewis_hamilton', constructorId: 'constructor_ferrari', gridPosition: 3, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [13, 47] },
    { driverId: 'driver_charles_leclerc', constructorId: 'constructor_ferrari', gridPosition: 4, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 49], paceRating: 92 },
    { driverId: 'driver_lando_norris', constructorId: 'constructor_mclaren', gridPosition: 5, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 48] },
    { driverId: 'driver_oscar_piastri', constructorId: 'constructor_mclaren', gridPosition: 6, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [16, 49] },
    { driverId: 'driver_max_verstappen', constructorId: 'constructor_red_bull', gridPosition: 7, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 47], paceRating: 94.0, consistency: 93 },
    { driverId: 'driver_pierre_gasly', constructorId: 'constructor_alpine', gridPosition: 8, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 47] },
    { driverId: 'driver_oliver_bearman', constructorId: 'constructor_haas', gridPosition: 9, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 48] },
    { driverId: 'driver_liam_lawson', constructorId: 'constructor_rb', gridPosition: 10, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [13, 47] },
    { driverId: 'driver_esteban_ocon', constructorId: 'constructor_alpine', gridPosition: 11, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 48] },
    { driverId: 'driver_sergio_perez', constructorId: 'constructor_red_bull', gridPosition: 12, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 49] },
    { driverId: 'driver_alexander_albon', constructorId: 'constructor_williams', gridPosition: 13, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [13, 48] },
    { driverId: 'driver_yuki_tsunoda', constructorId: 'constructor_rb', gridPosition: 14, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 47] },
    { driverId: 'driver_valtteri_bottas', constructorId: 'constructor_sauber', gridPosition: 15, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 49] },
    { driverId: 'driver_kevin_magnussen', constructorId: 'constructor_haas', gridPosition: 16, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 48] },
    { driverId: 'driver_carlos_sainz', constructorId: 'constructor_williams', gridPosition: 17, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [13, 47] },
    { driverId: 'driver_zhou_guanyu', constructorId: 'constructor_sauber', gridPosition: 18, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 48] },
    { driverId: 'driver_fernando_alonso', constructorId: 'constructor_aston_martin', gridPosition: 19, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [15, 49] },
    { driverId: 'driver_lance_stroll', constructorId: 'constructor_aston_martin', gridPosition: 20, baseStrategy: [TireCompound.MEDIUM, TireCompound.INTER, TireCompound.MEDIUM], plannedPitLaps: [14, 48] },
  ],
  qualifyingResults: [
    { driverId: 'driver_kimi_antonelli', constructorId: 'constructor_mercedes', q1Time: '1:12.890', q2Time: '1:12.110', q3Time: '1:11.890', position: 1 },
    { driverId: 'driver_george_russell', constructorId: 'constructor_mercedes', q1Time: '1:13.110', q2Time: '1:12.340', q3Time: '1:12.100', position: 2 },
    { driverId: 'driver_lewis_hamilton', constructorId: 'constructor_ferrari', q1Time: '1:13.200', q2Time: '1:12.450', q3Time: '1:12.220', position: 3 },
    { driverId: 'driver_charles_leclerc', constructorId: 'constructor_ferrari', q1Time: '1:13.050', q2Time: '1:12.400', q3Time: '1:12.290', position: 4 },
    { driverId: 'driver_lando_norris', constructorId: 'constructor_mclaren', q1Time: '1:13.400', q2Time: '1:12.500', q3Time: '1:12.350', position: 5 },
  ],
};
export default canada2026Seed;
