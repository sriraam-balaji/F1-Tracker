import * as fs from 'fs';
import * as path from 'path';
import { db } from '../src/services/f1/db';

async function main() {
  console.log('Starting pre-generation of F1 telemetry files...');

  const publicDir = path.join(process.cwd(), 'public');
  const dataDir = path.join(publicDir, 'data', 'races');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  const publicDataDir = path.join(publicDir, 'data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir);
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const races = Object.values(db.racesById);
  console.log(`Found ${races.length} races in the database.`);

  let writtenCount = 0;

  for (const race of races) {
    const raceId = race.id;
    const raceDir = path.join(dataDir, raceId);

    if (raceId === 'race_2023_canada' || raceId === 'race_2023_monaco') {
      console.log(`Skipping FastF1 race: ${raceId}`);
      continue;
    }

    if (!fs.existsSync(raceDir)) {
      fs.mkdirSync(raceDir);
    }

    const sessions = db.sessionsByRaceId[raceId] || [];
    const raceSession = sessions.find(s => s.type === 'RACE');
    const qualSession = sessions.find(s => s.type === 'QUALIFYING');

    // Write metadata.json
    fs.writeFileSync(
      path.join(raceDir, 'metadata.json'),
      JSON.stringify(race, null, 2)
    );

    // 1. Write sessions
    fs.writeFileSync(
      path.join(raceDir, 'sessions.json'),
      JSON.stringify(sessions, null, 2)
    );

    // 2. Write qualifying results if available
    if (qualSession) {
      const qualifyingResults = db.qualifyingBySessionId[qualSession.id] || [];
      fs.writeFileSync(
        path.join(raceDir, 'qualifying.json'),
        JSON.stringify(qualifyingResults, null, 2)
      );
    }

    // 3. Write race results if available
    if (raceSession) {
      const results = db.resultsBySessionId[raceSession.id] || [];
      fs.writeFileSync(
        path.join(raceDir, 'results.json'),
        JSON.stringify(results, null, 2)
      );

      // 4. Write weather snapshot if available
      const weather = db.weatherBySessionId[raceSession.id];
      if (weather) {
        fs.writeFileSync(
          path.join(raceDir, 'weather.json'),
          JSON.stringify(weather, null, 2)
        );
      }

      // 5. Write event timeline if available
      const timeline = db.timelineBySessionId[raceSession.id] || [];
      fs.writeFileSync(
        path.join(raceDir, 'timeline.json'),
        JSON.stringify(timeline, null, 2)
      );

      // 6. Write lap times telemetry if available
      const lapTimes = db.lapTimesBySessionId[raceSession.id] || {};
      fs.writeFileSync(
        path.join(raceDir, 'lap_times.json'),
        JSON.stringify(lapTimes, null, 2)
      );
    }

    writtenCount++;
    console.log(`Processed race: ${raceId} -> public/data/races/${raceId}/`);
  }

  console.log(`Successfully pre-generated static files for ${writtenCount} races!`);
}

main().catch(err => {
  console.error('Error pre-generating F1 files:', err);
  process.exit(1);
});
