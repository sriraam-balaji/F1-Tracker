import { DriverCareerHistory } from '../types';

export const mockDriverHistory: Record<string, DriverCareerHistory> = {
  driver_max_verstappen: {
    driverId: 'driver_max_verstappen',
    championships: 4,
    wins: 71,
    podiums: 128,
    poles: 48,
    entries: 238,
    careerPoints: 3487.5,
    biography: 'Max Verstappen is a Dutch Formula One racing driver competing for Oracle Red Bull Racing. Born in Hasselt, Belgium, he is the son of former F1 driver Jos Verstappen. Entering F1 in 2015 at just 17 years old with Scuderia Toro Rosso, he became the youngest ever Grand Prix winner when he was promoted to Red Bull Racing at the 2016 Spanish GP. Verstappen won four consecutive World Drivers\' Championships from 2021 to 2024, cementing his legacy as one of the sports most dominant drivers.',
    careerLog: [
      { year: 2025, team: 'Red Bull Racing', position: 2, points: 421, wins: 8, podiums: 15 },
      { year: 2024, team: 'Red Bull Racing', position: 1, points: 575, wins: 15, podiums: 20 },
      { year: 2023, team: 'Red Bull Racing', position: 1, points: 575, wins: 19, podiums: 21 },
      { year: 2022, team: 'Red Bull Racing', position: 1, points: 454, wins: 15, podiums: 17 },
      { year: 2021, team: 'Red Bull Racing', position: 1, points: 395.5, wins: 10, podiums: 18 },
      { year: 2020, team: 'Red Bull Racing', position: 3, points: 214, wins: 2, podiums: 11 },
      { year: 2019, team: 'Red Bull Racing', position: 3, points: 278, wins: 3, podiums: 9 },
      { year: 2018, team: 'Red Bull Racing', position: 4, points: 249, wins: 2, podiums: 11 },
      { year: 2017, team: 'Red Bull Racing', position: 6, points: 168, wins: 2, podiums: 4 },
      { year: 2016, team: 'Toro Rosso / Red Bull', position: 5, points: 204, wins: 1, podiums: 7 },
      { year: 2015, team: 'Toro Rosso', position: 12, points: 49, wins: 0, podiums: 0 }
    ]
  },
  driver_lando_norris: {
    driverId: 'driver_lando_norris',
    championships: 1,
    wins: 11,
    podiums: 45,
    poles: 12,
    entries: 149,
    careerPoints: 1255.0,
    biography: 'Lando Norris is a British-Belgian racing driver who has competed in Formula One since 2019, driving exclusively for McLaren. After claiming numerous junior karting titles and winning the FIA Formula 3 European Championship in 2017, Norris made a highly anticipated debut in F1. Undergoing steady progression alongside the Woking team, he secured his maiden win at the 2024 Miami GP. In 2025, Norris reached the pinnacle of his career by winning his first World Drivers\' Championship in a dramatic season-long battle with Max Verstappen.',
    careerLog: [
      { year: 2025, team: 'McLaren', position: 1, points: 423, wins: 7, podiums: 18 },
      { year: 2024, team: 'McLaren', position: 2, points: 331, wins: 3, podiums: 14 },
      { year: 2023, team: 'McLaren', position: 6, points: 205, wins: 0, podiums: 7 },
      { year: 2022, team: 'McLaren', position: 7, points: 122, wins: 0, podiums: 1 },
      { year: 2021, team: 'McLaren', position: 6, points: 160, wins: 0, podiums: 4 },
      { year: 2020, team: 'McLaren', position: 9, points: 97, wins: 0, podiums: 1 },
      { year: 2019, team: 'McLaren', position: 11, points: 49, wins: 0, podiums: 0 }
    ]
  },
  driver_charles_leclerc: {
    driverId: 'driver_charles_leclerc',
    championships: 0,
    wins: 8,
    podiums: 52,
    poles: 28,
    entries: 147,
    careerPoints: 1545.0,
    biography: 'Charles Leclerc is a Monégasque racing driver competing for Scuderia Ferrari. A member of the Ferrari Driver Academy, Leclerc won the GP3 Series in 2016 and the FIA Formula 2 Championship in 2017. He debuted in F1 with Sauber in 2018, earning a promotion to Ferrari just one year later. Known for his sensational qualifying speed, Leclerc won his first races in 2019 at Spa and Monza. He finished as championship runner-up in 2022 and remains the spearhead of Ferraris championship ambitions.',
    careerLog: [
      { year: 2025, team: 'Ferrari', position: 5, points: 242, wins: 1, podiums: 6 },
      { year: 2024, team: 'Ferrari', position: 3, points: 308, wins: 2, podiums: 11 },
      { year: 2023, team: 'Ferrari', position: 5, points: 206, wins: 0, podiums: 6 },
      { year: 2022, team: 'Ferrari', position: 2, points: 308, wins: 3, podiums: 11 },
      { year: 2021, team: 'Ferrari', position: 7, points: 159, wins: 0, podiums: 1 },
      { year: 2020, team: 'Ferrari', position: 8, points: 98, wins: 0, podiums: 2 },
      { year: 2019, team: 'Ferrari', position: 4, points: 264, wins: 2, podiums: 10 },
      { year: 2018, team: 'Sauber', position: 13, points: 39, wins: 0, podiums: 0 }
    ]
  },
  driver_oscar_piastri: {
    driverId: 'driver_oscar_piastri',
    championships: 0,
    wins: 9,
    podiums: 28,
    poles: 4,
    entries: 66,
    careerPoints: 673.0,
    biography: 'Oscar Piastri is an Australian racing driver competing for McLaren. Piastri boasts one of the most stellar junior careers in motorsport history, winning the Formula Renualt Eurocup (2019), FIA Formula 3 (2020), and FIA Formula 2 (2021) in consecutive rookie seasons. He entered F1 in 2023 with McLaren and claimed a Sprint race victory in Qatar during his rookie year. In 2024 and 2025, Piastri developed into a frequent Grand Prix winner, helping McLaren lock down back-to-back Constructors\' titles.',
    careerLog: [
      { year: 2025, team: 'McLaren', position: 3, points: 410, wins: 7, podiums: 16 },
      { year: 2024, team: 'McLaren', position: 4, points: 262, wins: 2, podiums: 7 },
      { year: 2023, team: 'McLaren', position: 9, points: 97, wins: 0, podiums: 2 }
    ]
  },
  driver_carlos_sainz: {
    driverId: 'driver_carlos_sainz',
    championships: 0,
    wins: 4,
    podiums: 29,
    poles: 6,
    entries: 226,
    careerPoints: 1228.0,
    biography: 'Carlos Sainz Jr. is a Spanish Formula One driver competing for Williams Racing. The son of double World Rally Champion Carlos Sainz, he entered F1 in 2015 through the Red Bull Junior Team. Over a versatile career, Sainz has driven for Toro Rosso, Renault, McLaren, and Scuderia Ferrari. During his four seasons at Ferrari, Sainz earned four career wins and a reputation for tactical mastery. He transitioned to Williams Racing in 2025 to lead their mid-field revival.',
    careerLog: [
      { year: 2025, team: 'Williams', position: 10, points: 64, wins: 0, podiums: 1 },
      { year: 2024, team: 'Ferrari', position: 5, points: 258, wins: 2, podiums: 8 },
      { year: 2023, team: 'Ferrari', position: 7, points: 200, wins: 1, podiums: 3 },
      { year: 2022, team: 'Ferrari', position: 5, points: 246, wins: 1, podiums: 9 },
      { year: 2021, team: 'Ferrari', position: 5, points: 164.5, wins: 0, podiums: 4 },
      { year: 2020, team: 'McLaren', position: 6, points: 105, wins: 0, podiums: 1 },
      { year: 2019, team: 'McLaren', position: 6, points: 96, wins: 0, podiums: 1 },
      { year: 2018, team: 'Renault', position: 10, points: 53, wins: 0, podiums: 0 },
      { year: 2017, team: 'Toro Rosso / Renault', position: 9, points: 54, wins: 0, podiums: 0 },
      { year: 2016, team: 'Toro Rosso', position: 12, points: 46, wins: 0, podiums: 0 },
      { year: 2015, team: 'Toro Rosso', position: 15, points: 18, wins: 0, podiums: 0 }
    ]
  },
  driver_george_russell: {
    driverId: 'driver_george_russell',
    championships: 0,
    wins: 6,
    podiums: 26,
    poles: 7,
    entries: 147,
    careerPoints: 912.0,
    biography: 'George Russell is a British Formula One driver racing for Mercedes-AMG PETRONAS. He secured the GP3 Series championship in 2017 and Formula 2 in 2018. Russell debuted with Williams in 2019, spending three seasons developing at the back of the grid. His impressive qualifying speed earned him the nickname "Mr. Thursday/Saturday." Russell joined Mercedes in 2022, securing his maiden Grand Prix victory at Sao Paulo later that year and stepping up to lead the Silver Arrows alongside rookie partner Kimi Antonelli.',
    careerLog: [
      { year: 2025, team: 'Mercedes', position: 4, points: 319, wins: 1, podiums: 8 },
      { year: 2024, team: 'Mercedes', position: 8, points: 180, wins: 1, podiums: 3 },
      { year: 2023, team: 'Mercedes', position: 8, points: 175, wins: 0, podiums: 2 },
      { year: 2022, team: 'Mercedes', position: 4, points: 275, wins: 1, podiums: 8 },
      { year: 2021, team: 'Williams', position: 15, points: 16, wins: 0, podiums: 1 },
      { year: 2020, team: 'Williams / Mercedes', position: 18, points: 3, wins: 0, podiums: 0 },
      { year: 2019, team: 'Williams', position: 20, points: 0, wins: 0, podiums: 0 }
    ]
  },
  driver_lewis_hamilton: {
    driverId: 'driver_lewis_hamilton',
    championships: 7,
    wins: 105,
    podiums: 204,
    poles: 104,
    entries: 385,
    careerPoints: 5090.5,
    biography: 'Sir Lewis Hamilton is a British racing driver competing for Scuderia Ferrari. Widely regarded as one of the greatest drivers in the history of the sport, he holds the record for the most wins (105), pole positions (104), and podium finishes (204). Hamilton entered F1 with McLaren in 2007, winning his first world title in 2008. He moved to Mercedes in 2013, claiming six further titles during a decade of record-breaking dominance. In 2025, Hamilton made a historic move to Scuderia Ferrari in search of an eighth crown.',
    careerLog: [
      { year: 2025, team: 'Ferrari', position: 6, points: 156, wins: 0, podiums: 3 },
      { year: 2024, team: 'Mercedes', position: 6, points: 223, wins: 2, podiums: 5 },
      { year: 2023, team: 'Mercedes', position: 3, points: 234, wins: 0, podiums: 6 },
      { year: 2022, team: 'Mercedes', position: 6, points: 240, wins: 0, podiums: 9 },
      { year: 2021, team: 'Mercedes', position: 2, points: 387.5, wins: 8, podiums: 17 },
      { year: 2020, team: 'Mercedes', position: 1, points: 347, wins: 11, podiums: 14 },
      { year: 2019, team: 'Mercedes', position: 1, points: 413, wins: 11, podiums: 17 },
      { year: 2018, team: 'Mercedes', position: 1, points: 408, wins: 11, podiums: 17 },
      { year: 2017, team: 'Mercedes', position: 1, points: 363, wins: 9, podiums: 13 },
      { year: 2016, team: 'Mercedes', position: 2, points: 380, wins: 10, podiums: 17 },
      { year: 2015, team: 'Mercedes', position: 1, points: 381, wins: 10, podiums: 17 },
      { year: 2014, team: 'Mercedes', position: 1, points: 384, wins: 11, podiums: 16 },
      { year: 2013, team: 'Mercedes', position: 4, points: 189, wins: 1, podiums: 5 },
      { year: 2012, team: 'McLaren', position: 4, points: 190, wins: 4, podiums: 7 },
      { year: 2011, team: 'McLaren', position: 5, points: 227, wins: 3, podiums: 6 },
      { year: 2010, team: 'McLaren', position: 4, points: 240, wins: 3, podiums: 9 },
      { year: 2009, team: 'McLaren', position: 5, points: 49, wins: 2, podiums: 5 },
      { year: 2008, team: 'McLaren', position: 1, points: 98, wins: 5, podiums: 10 },
      { year: 2007, team: 'McLaren', position: 2, points: 109, wins: 4, podiums: 12 }
    ]
  },
  driver_sergio_perez: {
    driverId: 'driver_sergio_perez',
    championships: 0,
    wins: 6,
    podiums: 39,
    poles: 3,
    entries: 295,
    careerPoints: 1712.0,
    biography: 'Sergio "Checo" Pérez is a Mexican Formula One driver competing for Oracle Red Bull Racing. Debuting in 2011 with Sauber, Pérez built a reputation as a master tire-saver, scoring multiple podiums in midfield machinery. He claimed a fairytale first victory at the 2020 Sakhir Grand Prix with Racing Point, which earned him a late career call-up to Red Bull in 2021. He played a critical role in Verstappens world championship triumphs and won five races with Red Bull before facing immense pressure in 2025/2026.',
    careerLog: [
      { year: 2025, team: 'Red Bull Racing', position: 8, points: 126, wins: 0, podiums: 2 },
      { year: 2024, team: 'Red Bull Racing', position: 7, points: 151, wins: 0, podiums: 4 },
      { year: 2023, team: 'Red Bull Racing', position: 2, points: 285, wins: 2, podiums: 9 },
      { year: 2022, team: 'Red Bull Racing', position: 3, points: 305, wins: 2, podiums: 11 },
      { year: 2021, team: 'Red Bull Racing', position: 4, points: 190, wins: 1, podiums: 5 },
      { year: 2020, team: 'Racing Point', position: 4, points: 125, wins: 1, podiums: 2 },
      { year: 2019, team: 'Racing Point', position: 10, points: 52, wins: 0, podiums: 0 },
      { year: 2018, team: 'Force India', position: 8, points: 62, wins: 0, podiums: 1 },
      { year: 2017, team: 'Force India', position: 7, points: 100, wins: 0, podiums: 0 },
      { year: 2016, team: 'Force India', position: 7, points: 101, wins: 0, podiums: 2 },
      { year: 2015, team: 'Force India', position: 9, points: 78, wins: 0, podiums: 1 },
      { year: 2014, team: 'Force India', position: 10, points: 59, wins: 0, podiums: 1 },
      { year: 2013, team: 'McLaren', position: 11, points: 49, wins: 0, podiums: 0 },
      { year: 2012, team: 'Sauber', position: 10, points: 66, wins: 0, podiums: 3 },
      { year: 2011, team: 'Sauber', position: 16, points: 14, wins: 0, podiums: 0 }
    ]
  },
  driver_fernando_alonso: {
    driverId: 'driver_fernando_alonso',
    championships: 2,
    wins: 32,
    podiums: 106,
    poles: 22,
    entries: 433,
    careerPoints: 2393.0,
    biography: 'Fernando Alonso is a Spanish racing legend currently competing for Aston Martin Aramco. Debuting in 2001 with Minardi, Alonso is the most experienced driver in F1 history. He claimed back-to-back championships with Renault in 2005 and 2006, breaking Michael Schumachers streak of dominance. Famous for his aggressive driving and fierce competitive drive, he has driven for Renault, McLaren, Ferrari, and Alpine. Alonso experienced a career resurgence at Aston Martin starting in 2023, capturing multiple podiums.',
    careerLog: [
      { year: 2025, team: 'Aston Martin', position: 11, points: 56, wins: 0, podiums: 0 },
      { year: 2024, team: 'Aston Martin', position: 9, points: 62, wins: 0, podiums: 0 },
      { year: 2023, team: 'Aston Martin', position: 4, points: 206, wins: 0, podiums: 8 },
      { year: 2022, team: 'Alpine', position: 9, points: 81, wins: 0, podiums: 0 },
      { year: 2021, team: 'Alpine', position: 10, points: 81, wins: 0, podiums: 1 },
      { year: 2018, team: 'McLaren', position: 11, points: 50, wins: 0, podiums: 0 },
      { year: 2017, team: 'McLaren', position: 15, points: 17, wins: 0, podiums: 0 },
      { year: 2016, team: 'McLaren', position: 10, points: 54, wins: 0, podiums: 0 },
      { year: 2015, team: 'McLaren', position: 17, points: 11, wins: 0, podiums: 0 },
      { year: 2014, team: 'Ferrari', position: 6, points: 161, wins: 0, podiums: 2 },
      { year: 2013, team: 'Ferrari', position: 2, points: 242, wins: 2, podiums: 9 },
      { year: 2012, team: 'Ferrari', position: 2, points: 278, wins: 3, podiums: 13 },
      { year: 2011, team: 'Ferrari', position: 4, points: 257, wins: 1, podiums: 10 },
      { year: 2010, team: 'Ferrari', position: 2, points: 252, wins: 5, podiums: 10 },
      { year: 2009, team: 'Renault', position: 9, points: 26, wins: 0, podiums: 1 },
      { year: 2008, team: 'Renault', position: 5, points: 61, wins: 2, podiums: 3 },
      { year: 2007, team: 'McLaren', position: 3, points: 109, wins: 4, podiums: 12 },
      { year: 2006, team: 'Renault', position: 1, points: 134, wins: 7, podiums: 14 },
      { year: 2005, team: 'Renault', position: 1, points: 133, wins: 7, podiums: 15 },
      { year: 2003, team: 'Renault', position: 6, points: 55, wins: 1, podiums: 4 },
      { year: 2001, team: 'Minardi', position: 23, points: 0, wins: 0, podiums: 0 }
    ]
  },
  driver_pierre_gasly: {
    driverId: 'driver_pierre_gasly',
    championships: 0,
    wins: 1,
    podiums: 4,
    poles: 0,
    entries: 162,
    careerPoints: 462.0,
    biography: 'Pierre Gasly is a French racing driver competing for Alpine. Entering F1 in late 2017 with Toro Rosso, Gasly earned a promotion to Red Bull Racing for 2019. Following a challenging stint, he was demoted back to Toro Rosso mid-season, setting up one of the sports greatest redemption stories. In 2020, Gasly achieved a legendary maiden victory at the Italian GP with AlphaTauri. He moved to Alpine in 2023 to establish an all-French partnership.',
    careerLog: [
      { year: 2025, team: 'Alpine', position: 19, points: 22, wins: 0, podiums: 0 },
      { year: 2024, team: 'Alpine', position: 11, points: 42, wins: 0, podiums: 1 },
      { year: 2023, team: 'Alpine', position: 11, points: 62, wins: 0, podiums: 1 },
      { year: 2022, team: 'AlphaTauri', position: 14, points: 23, wins: 0, podiums: 0 },
      { year: 2021, team: 'AlphaTauri', position: 9, points: 110, wins: 0, podiums: 1 },
      { year: 2020, team: 'AlphaTauri', position: 10, points: 75, wins: 1, podiums: 1 },
      { year: 2019, team: 'Red Bull / Toro Rosso', position: 7, points: 95, wins: 0, podiums: 1 },
      { year: 2018, team: 'Toro Rosso', position: 15, points: 29, wins: 0, podiums: 0 },
      { year: 2017, team: 'Toro Rosso', position: 21, points: 0, wins: 0, podiums: 0 }
    ]
  },
  driver_kimi_antonelli: {
    driverId: 'driver_kimi_antonelli',
    championships: 0,
    wins: 4,
    podiums: 8,
    poles: 3,
    entries: 32,
    careerPoints: 281.0,
    biography: 'Andrea Kimi Antonelli is an Italian prodigy competing for Mercedes-AMG PETRONAS. Highly decorated in karting and a member of the Mercedes Junior Team since 2019, he skipped Formula 3 entirely, jumping straight to Formula 2 in 2024. Following Lewis Hamiltons departure to Ferrari, Mercedes selected Antonelli to debut in 2025 at just 18 years old. After showing spectacular raw speed and scoring podiums in 2025, Antonelli has emerged as a major championship leader in the 2026 season.',
    careerLog: [
      { year: 2025, team: 'Mercedes', position: 7, points: 150, wins: 0, podiums: 2 }
    ]
  },
  driver_oliver_bearman: {
    driverId: 'driver_oliver_bearman',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 26,
    careerPoints: 65.0,
    biography: 'Oliver Bearman is a British racing driver competing for MoneyGram Haas F1 Team. A member of the Ferrari Driver Academy, Bearman shot to prominence at the 2024 Saudi Arabian GP when he substituted for Carlos Sainz at Ferrari on just a few hours\' notice, scoring points on debut. Following several impressive F2 outings, Bearman secured a full-time seat with Haas for 2025, cementing his status as one of British motorsport\'s top rising stars.',
    careerLog: [
      { year: 2025, team: 'Haas', position: 14, points: 41, wins: 0, podiums: 0 },
      { year: 2024, team: 'Ferrari / Haas', position: 17, points: 7, wins: 0, podiums: 0 }
    ]
  },
  driver_liam_lawson: {
    driverId: 'driver_liam_lawson',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 31,
    careerPoints: 56.0,
    biography: 'Liam Lawson is a New Zealand racing driver competing for Visa Cash App RB. A Red Bull Junior team member since 2019, Lawson made a stellar temporary substitution for an injured Daniel Ricciardo at AlphaTauri in 2023, scoring points in Singapore. He returned to a full-time seat in late 2024 and secured his future with the RB team, showing consistent points scoring ability.',
    careerLog: [
      { year: 2025, team: 'RB', position: 15, points: 38, wins: 0, podiums: 0 },
      { year: 2024, team: 'RB', position: 20, points: 2, wins: 0, podiums: 0 },
      { year: 2023, team: 'AlphaTauri', position: 20, points: 2, wins: 0, podiums: 0 }
    ]
  },
  driver_alexander_albon: {
    driverId: 'driver_alexander_albon',
    championships: 0,
    wins: 0,
    podiums: 2,
    poles: 0,
    entries: 122,
    careerPoints: 308.0,
    biography: 'Alexander Albon is a Thai-British racing driver competing for Williams Racing. Entering F1 with Toro Rosso in 2019, he was promoted to Red Bull Racing mid-season. After two podium finishes, Albon lost his race seat in 2021, spending a year as Red Bulls test driver. He returned to the grid with Williams in 2022, rapidly establishing himself as the teams clear leader and carrying the legendary grove-based team to numerous top-10 finishes.',
    careerLog: [
      { year: 2025, team: 'Williams', position: 9, points: 73, wins: 0, podiums: 1 },
      { year: 2024, team: 'Williams', position: 15, points: 12, wins: 0, podiums: 0 },
      { year: 2023, team: 'Williams', position: 13, points: 27, wins: 0, podiums: 0 },
      { year: 2022, team: 'Williams', position: 19, points: 4, wins: 0, podiums: 0 },
      { year: 2020, team: 'Red Bull', position: 7, points: 105, wins: 0, podiums: 2 },
      { year: 2019, team: 'Toro Rosso / Red Bull', position: 8, points: 92, wins: 0, podiums: 0 }
    ]
  },
  driver_esteban_ocon: {
    driverId: 'driver_esteban_ocon',
    championships: 0,
    wins: 1,
    podiums: 3,
    poles: 0,
    entries: 176,
    careerPoints: 461.0,
    biography: 'Esteban Ocon is a French Formula One driver competing for MoneyGram Haas F1 Team. Making his debut in 2016 with Manor, Ocon has driven for Force India, Renault, and Alpine. He scored a sensational, historic victory at the 2021 Hungarian GP with Alpine. Following a lengthy tenure with the French outfit, Ocon signed with Haas for the 2025 season to partner Oliver Bearman.',
    careerLog: [
      { year: 2025, team: 'Haas', position: 16, points: 38, wins: 0, podiums: 0 },
      { year: 2024, team: 'Alpine', position: 14, points: 23, wins: 0, podiums: 0 },
      { year: 2023, team: 'Alpine', position: 12, points: 58, wins: 0, podiums: 1 },
      { year: 2022, team: 'Alpine', position: 8, points: 92, wins: 0, podiums: 0 },
      { year: 2021, team: 'Alpine', position: 11, points: 74, wins: 1, podiums: 1 },
      { year: 2020, team: 'Renault', position: 12, points: 62, wins: 0, podiums: 1 },
      { year: 2018, team: 'Force India', position: 12, points: 49, wins: 0, podiums: 0 },
      { year: 2017, team: 'Force India', position: 8, points: 87, wins: 0, podiums: 0 },
      { year: 2016, team: 'Manor', position: 23, points: 0, wins: 0, podiums: 0 }
    ]
  },
  driver_yuki_tsunoda: {
    driverId: 'driver_yuki_tsunoda',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 111,
    careerPoints: 125.0,
    biography: 'Yuki Tsunoda is a Japanese Formula One driver racing for Visa Cash App RB. Backed by Honda and the Red Bull Junior Team, Tsunoda debuted in 2021 with AlphaTauri. Over successive seasons, Tsunoda has grown from an aggressive, hot-headed rookie into a mature, consistent leader of the Faenza squad. In 2025/2026, he continues to lead RBs midfield charge while targeting a future Red Bull senior seat.',
    careerLog: [
      { year: 2025, team: 'Red Bull / RB', position: 18, points: 33, wins: 0, podiums: 0 },
      { year: 2024, team: 'RB', position: 12, points: 28, wins: 0, podiums: 0 },
      { year: 2023, team: 'AlphaTauri', position: 14, points: 17, wins: 0, podiums: 0 },
      { year: 2022, team: 'AlphaTauri', position: 17, points: 12, wins: 0, podiums: 0 },
      { year: 2021, team: 'AlphaTauri', position: 14, points: 32, wins: 0, podiums: 0 }
    ]
  },
  driver_lance_stroll: {
    driverId: 'driver_lance_stroll',
    championships: 0,
    wins: 0,
    podiums: 3,
    poles: 1,
    entries: 185,
    careerPoints: 312.0,
    biography: 'Lance Stroll is a Canadian-Belgian Formula One driver competing for Aston Martin Aramco. He became the second-youngest driver to finish on the podium when he scored a 3rd place finish at the 2017 Azerbaijani GP with Williams. Stroll has raced for Racing Point and Aston Martin, where his father Lawrence Stroll is executive chairman. Strolls career includes a spectacular wet-weather pole position at Turkey in 2020.',
    careerLog: [
      { year: 2025, team: 'Aston Martin', position: 17, points: 26, wins: 0, podiums: 0 },
      { year: 2024, team: 'Aston Martin', position: 10, points: 24, wins: 0, podiums: 0 },
      { year: 2023, team: 'Aston Martin', position: 10, points: 74, wins: 0, podiums: 0 },
      { year: 2022, team: 'Aston Martin', position: 15, points: 18, wins: 0, podiums: 0 },
      { year: 2021, team: 'Aston Martin', position: 13, points: 34, wins: 0, podiums: 0 },
      { year: 2020, team: 'Racing Point', position: 11, points: 75, wins: 0, podiums: 2 },
      { year: 2019, team: 'Racing Point', position: 15, points: 21, wins: 0, podiums: 0 },
      { year: 2018, team: 'Williams', position: 18, points: 6, wins: 0, podiums: 0 },
      { year: 2017, team: 'Williams', position: 12, points: 40, wins: 0, podiums: 1 }
    ]
  },
  driver_kevin_magnussen: {
    driverId: 'driver_kevin_magnussen',
    championships: 0,
    wins: 0,
    podiums: 1,
    poles: 1,
    entries: 198,
    careerPoints: 207.0,
    biography: 'Kevin Magnussen is a Danish Formula One driver competing for MoneyGram Haas F1 Team. The son of former F1 racer Jan Magnussen, Kevin made a fairytale debut in 2014 by finishing 2nd for McLaren at the Australian Grand Prix. Following a stint at Renault, Magnussen became a mainstay at Haas, claiming the teams first ever pole position at Brazil in 2022. He is known for his defensive driving skills.',
    careerLog: [
      { year: 2025, team: 'Haas / Out', position: 21, points: 0, wins: 0, podiums: 0 },
      { year: 2024, team: 'Haas', position: 15, points: 14, wins: 0, podiums: 0 },
      { year: 2023, team: 'Haas', position: 19, points: 3, wins: 0, podiums: 0 },
      { year: 2022, team: 'Haas', position: 13, points: 25, wins: 0, podiums: 0 },
      { year: 2020, team: 'Haas', position: 20, points: 1, wins: 0, podiums: 0 },
      { year: 2019, team: 'Haas', position: 16, points: 28, wins: 0, podiums: 0 },
      { year: 2018, team: 'Haas', position: 9, points: 56, wins: 0, podiums: 0 },
      { year: 2017, team: 'Haas', position: 14, points: 19, wins: 0, podiums: 0 },
      { year: 2016, team: 'Renault', position: 16, points: 7, wins: 0, podiums: 0 },
      { year: 2014, team: 'McLaren', position: 11, points: 55, wins: 0, podiums: 1 }
    ]
  },
  driver_valtteri_bottas: {
    driverId: 'driver_valtteri_bottas',
    championships: 0,
    wins: 10,
    podiums: 67,
    poles: 20,
    entries: 258,
    careerPoints: 1797.0,
    biography: 'Valtteri Bottas is a Finnish racing driver competing for Stake F1 Team Kick Sauber. Debuting in 2013 with Williams, Bottas moved to Mercedes in 2017 as Nico Rosbergs replacement. Over five seasons, Bottas secured 10 victories and 20 pole positions, contributing significantly to Mercedes five consecutive Constructors\' championships. He transitioned to Alfa Romeo/Sauber in 2022 to provide crucial technical and team leadership.',
    careerLog: [
      { year: 2025, team: 'Sauber', position: 13, points: 51, wins: 0, podiums: 0 },
      { year: 2024, team: 'Sauber', position: 22, points: 0, wins: 0, podiums: 0 },
      { year: 2023, team: 'Alfa Romeo', position: 15, points: 10, wins: 0, podiums: 0 },
      { year: 2022, team: 'Alfa Romeo', position: 10, points: 49, wins: 0, podiums: 0 },
      { year: 2021, team: 'Mercedes', position: 3, points: 226, wins: 1, podiums: 11 },
      { year: 2020, team: 'Mercedes', position: 2, points: 223, wins: 2, podiums: 11 },
      { year: 2019, team: 'Mercedes', position: 2, points: 326, wins: 4, podiums: 15 },
      { year: 2018, team: 'Mercedes', position: 5, points: 247, wins: 0, podiums: 8 },
      { year: 2017, team: 'Mercedes', position: 3, points: 305, wins: 3, podiums: 13 },
      { year: 2016, team: 'Williams', position: 8, points: 85, wins: 0, podiums: 1 },
      { year: 2015, team: 'Williams', position: 5, points: 136, wins: 0, podiums: 2 },
      { year: 2014, team: 'Williams', position: 4, points: 186, wins: 0, podiums: 6 },
      { year: 2013, team: 'Williams', position: 17, points: 4, wins: 0, podiums: 0 }
    ]
  },
  driver_zhou_guanyu: {
    driverId: 'driver_zhou_guanyu',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 94,
    careerPoints: 14.0,
    biography: 'Zhou Guanyu is the first ever Chinese Formula One driver, currently competing for Stake F1 Team Kick Sauber. Backed by the Alpine Academy, Zhou spent multiple seasons in F2 before making his F1 debut in 2022 with Alfa Romeo. He scored points on his debut race in Bahrain and developed a reputation for reliable driving and excellent tire management under pressure.',
    careerLog: [
      { year: 2025, team: 'Sauber', position: 22, points: 0, wins: 0, podiums: 0 },
      { year: 2024, team: 'Sauber', position: 21, points: 0, wins: 0, podiums: 0 },
      { year: 2023, team: 'Alfa Romeo', position: 18, points: 6, wins: 0, podiums: 0 },
      { year: 2022, team: 'Alfa Romeo', position: 18, points: 6, wins: 0, podiums: 0 }
    ]
  },
  driver_isack_hadjar: {
    driverId: 'driver_isack_hadjar',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 26,
    careerPoints: 51.0,
    biography: 'Isack Hadjar is an Algerian-French racing driver competing for Visa Cash App RB. A highly-rated member of the Red Bull Junior Team, Hadjar entered F1 full-time in 2025 after a title-contending F2 campaign. He quickly validated Red Bulls support with a series of aggressive, point-scoring finishes.',
    careerLog: [
      { year: 2025, team: 'RB', position: 12, points: 51, wins: 0, podiums: 0 }
    ]
  },
  driver_gabriel_bortoleto: {
    driverId: 'driver_gabriel_bortoleto',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 26,
    careerPoints: 19.0,
    biography: 'Gabriel Bortoleto is a Brazilian Formula One driver competing for Stake F1 Team Kick Sauber. A client of Fernando Alonsos A14 management, Bortoleto won the FIA Formula 3 championship on debut in 2023 and completed a highly successful campaign in F2. He joined Sauber in 2025 to represent Brazil\'s next generation of F1 talent.',
    careerLog: [
      { year: 2025, team: 'Sauber', position: 20, points: 19, wins: 0, podiums: 0 }
    ]
  },
  driver_franco_colapinto: {
    driverId: 'driver_franco_colapinto',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 31,
    careerPoints: 15.0,
    biography: 'Franco Colapinto is an Argentine racing driver competing for Alpine. After stepping into Williams in late 2024 to replace Logan Sargeant and scoring points on debut, Colapinto generated massive fan support. In 2025, he signed with Alpine to provide crucial depth and energy to their mid-field operations.',
    careerLog: [
      { year: 2025, team: 'Williams / Alpine', position: 21, points: 0, wins: 0, podiums: 0 },
      { year: 2024, team: 'Williams', position: 18, points: 5, wins: 0, podiums: 0 }
    ]
  },
  driver_jack_doohan: {
    driverId: 'driver_jack_doohan',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    entries: 26,
    careerPoints: 0.0,
    biography: 'Jack Doohan is an Australian racing driver competing for Alpine. The son of motorcycle racing legend Mick Doohan, Jack spent multiple seasons as Alpines reserve driver. He was promoted to a full-time seat in 2025, bringing strong simulator and test experience to the French team.',
    careerLog: [
      { year: 2025, team: 'Alpine', position: 22, points: 0, wins: 0, podiums: 0 }
    ]
  }
};
